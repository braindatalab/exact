# worker/emd.py - mit detailliertem Logging
import numpy as np
import torch as t
import pickle as pkl
import os
import sys
from scipy.spatial.distance import cdist
from ot.lp import emd

print("--- EMD WORKER START ---", flush=True)

def create_cost_matrix(edge_length=8):
    mat = np.indices((edge_length, edge_length))
    coords = []
    for i in range(edge_length):
        for j in range(edge_length):
            coords.append((mat[0][i][j], mat[1][i][j]))
    coords = np.array(coords)
    return cdist(coords, coords)

def sum_to_1(mat):
    total = np.sum(mat)
    if total == 0: return mat
    return mat / total

def continuous_emd(gt_mask, attribution, n_dim=64):
    cost_matrix = create_cost_matrix(8)
    try:
        gt_norm = sum_to_1(gt_mask.reshape(n_dim)).astype(np.float64)
        attr_norm = sum_to_1(np.abs(attribution).reshape(n_dim)).astype(np.float64)
        if np.sum(attr_norm) == 0:
            print("[EMD] WARNUNG: Attribution-Summe ist Null. EMD kann nicht berechnet werden.", flush=True)
            return 0.0
        _, log = emd(gt_norm, attr_norm, cost_matrix, numItermax=200000, log=True)
        max_dist = np.sqrt(2 * (7**2))
        return 1 - (log['cost'] / max_dist)
    except Exception as e:
        print(f"[EMD] Fehler in continuous_emd: {e}", flush=True)
        return 0.0

try:
    print("[EMD] Lese 'xai_method' aus Umgebungsvariable...", flush=True)
    xai_method = os.getenv('xai_method')
    if not xai_method:
        print("[EMD] FEHLER: 'xai_method' ist leer oder nicht gesetzt.", flush=True)
        sys.exit(1)
    print("[EMD] 'xai_method' erfolgreich gelesen.", flush=True)

    print("[EMD] Lade Daten und Modell...", flush=True)
    data_path = "./data/linear_1d1p_0.18_uncorrelated.pkl"
    model_path = "./ai_model/linear_1d1p_0.18_uncorrelated_LLR_1_0.pt"
    with open(data_path, 'rb') as file:
        data = pkl.load(file)
    model = t.load(model_path)
    d = data["linear_1d1p_0.18_uncorrelated"]
    print("[EMD] Daten und Modell geladen.", flush=True)

    batch_size = min(10, len(d.x_train))
    x_train_batch = d.x_train[:batch_size].to(t.float)
    y_train_batch = d.y_train[:batch_size]

    print("[EMD] Führe 'exec(xai_method)' aus...", flush=True)
    safe_namespace = {'torch': t, 't': t, 'captum': __import__('captum')}
    exec(xai_method, safe_namespace)
    print("[EMD] 'exec' erfolgreich ausgeführt.", flush=True)

    if 'XAI_Method' not in safe_namespace:
        print("[EMD] FEHLER: 'XAI_Method' nicht im Namespace gefunden nach exec.", flush=True)
        raise ValueError("'XAI_Method' function not found in submitted code.")
    
    XAI_Method = safe_namespace['XAI_Method']
    print("[EMD] Rufe die XAI_Method auf...", flush=True)
    explanations = XAI_Method(x_train_batch, y_train_batch, model)
    print("[EMD] XAI_Method erfolgreich aufgerufen.", flush=True)

    print("[EMD] Berechne EMD-Scores...", flush=True)
    emd_scores = [continuous_emd(d.masks_train[i], explanations[i].detach().numpy()) for i in range(batch_size)]
    mean_score = np.mean(emd_scores)
    std_score = np.std(emd_scores)
    print(f"EMD Mean: {mean_score:.4f}", flush=True)
    print(f"EMD Std: {std_score:.4f}", flush=True)
    print(f"FINAL_SCORE:{mean_score}", flush=True)
    print("--- EMD WORKER ENDE ---", flush=True)

except Exception as e:
    print(f"[EMD] Ein unerwarteter Fehler ist aufgetreten: {e}", flush=True)
    import traceback
    traceback.print_exc()
    print("FINAL_SCORE:0.0", flush=True)
    sys.exit(1)