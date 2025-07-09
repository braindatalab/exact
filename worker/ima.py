import numpy as np
import torch as t
import pickle as pkl
import os
import sys

def importance_mass_accuracy(gt_mask, attribution):
    gt_mask_flat = gt_mask.flatten()
    attribution_flat = np.abs(attribution.flatten())
    total_importance = np.sum(attribution_flat)
    if total_importance == 0:
        return 0.0
    importance_in_gt = np.sum(attribution_flat[gt_mask_flat == 1])
    return importance_in_gt / total_importance

try:
    xai_method = os.getenv('xai_method')
    model_filename = os.getenv('MODEL_FILE')
    data_filename = os.getenv('DATA_FILE')

    if not xai_method or not model_filename or not data_filename:
        sys.exit(1)

    data_path = f"./data/{data_filename}"
    model_path = f"./ai_model/{model_filename}"

    with open(data_path, 'rb') as file:
        data = pkl.load(file)
    model = t.load(model_path)
    
    data_key = os.path.splitext(data_filename)[0]
    d = data[data_key]

    batch_size = min(100, len(d.x_train))
    x_train_batch = d.x_train[:batch_size].to(t.float)
    y_train_batch = d.y_train[:batch_size]

    if "CNN" in model_filename:
        x_train_batch = x_train_batch.reshape(-1, 1, 8, 8)
    
    safe_namespace = {'torch': t, 't': t, 'captum': __import__('captum')}
    exec(xai_method, safe_namespace)

    XAI_Method = safe_namespace['XAI_Method']
    explanations = XAI_Method(x_train_batch, y_train_batch, model)
    
    ima_scores = [importance_mass_accuracy(d.masks_train[i], explanations[i].detach().numpy()) for i in range(batch_size)]
    mean_score = np.mean(ima_scores)
    std_score = np.std(ima_scores)

    print(f"IMA Mean: {mean_score:.4f}", flush=True)
    print(f"IMA Std: {std_score:.4f}", flush=True)
    print(f"FINAL_SCORE:{mean_score}", flush=True)

except Exception as e:
    print(f"An unexpected error occurred in ima.py: {e}", flush=True)
    import traceback
    traceback.print_exc()
    print("FINAL_SCORE:0.0", flush=True)
    sys.exit(1)