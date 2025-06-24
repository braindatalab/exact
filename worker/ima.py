# worker/ima.py - mit detailliertem Logging
import numpy as np
import torch as t
import pickle as pkl
import os
import sys

print("--- IMA WORKER START ---", flush=True)

def importance_mass_accuracy(gt_mask, attribution):
    gt_mask_flat = gt_mask.flatten()
    attribution_flat = np.abs(attribution.flatten())
    total_importance = np.sum(attribution_flat)
    if total_importance == 0:
        print("[IMA] WARNUNG: Gesamte Wichtigkeit ist Null. IMA-Score ist 0.", flush=True)
        return 0.0
    importance_in_gt = np.sum(attribution_flat[gt_mask_flat == 1])
    return importance_in_gt / total_importance

try:
    print("[IMA] Lese 'xai_method' aus Umgebungsvariable...", flush=True)
    xai_method = os.getenv('xai_method')
    if not xai_method:
        print("[IMA] FEHLER: 'xai_method' ist leer oder nicht gesetzt.", flush=True)
        sys.exit(1)
    print("[IMA] 'xai_method' erfolgreich gelesen.", flush=True)

    print("[IMA] Lade Daten und Modell...", flush=True)
    data_path = "./data/linear_1d1p_0.18_uncorrelated.pkl"
    model_path = "./ai_model/linear_1d1p_0.18_uncorrelated_LLR_1_0.pt"
    with open(data_path, 'rb') as file:
        data = pkl.load(file)
    model = t.load(model_path)
    d = data["linear_1d1p_0.18_uncorrelated"]
    print("[IMA] Daten und Modell geladen.", flush=True)

    batch_size = min(10, len(d.x_train))
    x_train_batch = d.x_train[:batch_size].to(t.float)
    y_train_batch = d.y_train[:batch_size]

    print("[IMA] Führe 'exec(xai_method)' aus...", flush=True)
    safe_namespace = {'torch': t, 't': t, 'captum': __import__('captum')}
    exec(xai_method, safe_namespace)
    print("[IMA] 'exec' erfolgreich ausgeführt.", flush=True)

    if 'XAI_Method' not in safe_namespace:
        print("[IMA] FEHLER: 'XAI_Method' nicht im Namespace gefunden nach exec.", flush=True)
        raise ValueError("'XAI_Method' function not found in submitted code.")
    
    XAI_Method = safe_namespace['XAI_Method']
    print("[IMA] Rufe die XAI_Method auf...", flush=True)
    explanations = XAI_Method(x_train_batch, y_train_batch, model)
    print("[IMA] XAI_Method erfolgreich aufgerufen.", flush=True)

    print("[IMA] Berechne IMA-Scores...", flush=True)
    ima_scores = [importance_mass_accuracy(d.masks_train[i], explanations[i].detach().numpy()) for i in range(batch_size)]
    mean_score = np.mean(ima_scores)
    std_score = np.std(ima_scores)
    print(f"IMA Mean: {mean_score:.4f}", flush=True)
    print(f"IMA Std: {std_score:.4f}", flush=True)
    print(f"FINAL_SCORE:{mean_score}", flush=True)
    print("--- IMA WORKER ENDE ---", flush=True)

except Exception as e:
    print(f"[IMA] Ein unerwarteter Fehler ist aufgetreten: {e}", flush=True)
    import traceback
    traceback.print_exc()
    print("FINAL_SCORE:0.0", flush=True)
    sys.exit(1)