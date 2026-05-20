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

    batch_size = min(10, len(d.x_test))
    x_test_batch = d.x_test[:batch_size].to(t.float)
    y_test_batch = d.y_test[:batch_size]

    print("[EMD] Führe 'exec(xai_method)' aus...", flush=True)
    safe_namespace = {'torch': t, 't': t, 'captum': __import__('captum')}
    exec(xai_method, safe_namespace)
    print("[EMD] 'exec' erfolgreich ausgeführt.", flush=True)

    if 'XAI_Method' not in safe_namespace:
        print("[EMD] FEHLER: 'XAI_Method' nicht im Namespace gefunden nach exec.", flush=True)
        raise ValueError("'XAI_Method' function not found in submitted code.")
    
    XAI_Method = safe_namespace['XAI_Method']
    print("[EMD] Rufe die XAI_Method auf...", flush=True)
    explanations = XAI_Method(x_test_batch, y_test_batch, model)
    print("[EMD] XAI_Method erfolgreich aufgerufen.", flush=True)

    print("[EMD] Berechne EMD-Scores...", flush=True)
    emd_scores = [continuous_emd(d.masks_test[i], explanations[i].detach().numpy()) for i in range(batch_size)]
    mean_score = np.mean(emd_scores)
    std_score = np.std(emd_scores)
    print(f"EMD Mean: {mean_score:.4f}", flush=True)
    print(f"EMD Std: {std_score:.4f}", flush=True)
    print(f"FINAL_SCORE:{mean_score}", flush=True)

    print("[EMD] Generiere Heatmap-Plot...", flush=True)
    import matplotlib.pyplot as plt
    import io
    import base64

    # Combined ground truth
    normal_t = [[1,0],[1,1],[1,0]]
    normal_l = [[1,0],[1,0],[1,1]]
    combined_mask = np.zeros((8,8))
    combined_mask[1:4, 1:3] = normal_t
    combined_mask[4:7, 5:7] = normal_l
    combined_mask = combined_mask.reshape((8,8))

    plt.style.use('seaborn-v0_8-colorblind')
    fig, axes = plt.subplots(3, batch_size, figsize=(2 * batch_size, 6))
    if batch_size == 1:
        axes = np.expand_dims(axes, 1)
        
    use_combined_gt = "translations_rotations" not in data_path and "translations_rotations" not in model_path

    for i in range(batch_size):
        edge_length = int(np.sqrt(x_test_batch[i].shape[0]))
        
        # Row 0: Data
        data_img = x_test_batch[i].detach().numpy().reshape(edge_length, edge_length)
        axes[0, i].imshow(data_img, cmap='RdBu_r', vmin=-1, vmax=1)
        axes[0, i].axis('off')
        axes[0, i].set_title(f"Sample #{i}", fontsize=10)
        if i == 0:
            axes[0, i].text(-0.2, 0.5, 'Data', va='center', ha='right', rotation=90, transform=axes[0, i].transAxes, fontsize=12)
        
        # Row 1: Ground Truth
        if use_combined_gt and edge_length == 8:
            gt_img = combined_mask
        else:
            gt_img = d.masks_test[i].reshape(edge_length, edge_length)
            
        axes[1, i].imshow(gt_img, cmap='magma', vmin=0, vmax=1)
        axes[1, i].axis('off')
        if i == 0:
            axes[1, i].text(-0.2, 0.5, 'Ground\nTruth', va='center', ha='right', rotation=90, transform=axes[1, i].transAxes, fontsize=12)
        
        # Row 2: XAI Heatmap
        xai_img = np.abs(explanations[i].detach().numpy()).reshape(edge_length, edge_length)
        axes[2, i].imshow(xai_img, cmap='magma')
        axes[2, i].axis('off')
        if i == 0:
            axes[2, i].text(-0.2, 0.5, 'Explanation', va='center', ha='right', rotation=90, transform=axes[2, i].transAxes, fontsize=12)

    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png', bbox_inches='tight')
    plt.close(fig)
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    print(f"PLOT_DATA_START:{img_base64}:PLOT_DATA_END", flush=True)

    print("--- EMD WORKER ENDE ---", flush=True)

except Exception as e:
    print(f"[EMD] Ein unerwarteter Fehler ist aufgetreten: {e}", flush=True)
    import traceback
    traceback.print_exc()
    print("FINAL_SCORE:0.0", flush=True)
    sys.exit(1)