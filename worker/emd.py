import numpy as np
import torch as t
import pickle as pkl
import os
import sys
from scipy.spatial.distance import cdist
from ot.lp import emd

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
            return 0.0
        _, log = emd(gt_norm, attr_norm, cost_matrix, numItermax=200000, log=True)
        max_dist = np.sqrt(2 * (7**2))
        return 1 - (log['cost'] / max_dist)
    except Exception as e:
        return 0.0

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

    emd_scores = [continuous_emd(d.masks_train[i], explanations[i].detach().numpy()) for i in range(batch_size)]
    mean_score = np.mean(emd_scores)
    std_score = np.std(emd_scores)
    
    print(f"EMD Mean: {mean_score:.4f}", flush=True)
    print(f"EMD Std: {std_score:.4f}", flush=True)
    print(f"FINAL_SCORE:{mean_score}", flush=True)

except Exception as e:
    print(f"An unexpected error occurred in emd.py: {e}", flush=True)
    import traceback
    traceback.print_exc()
    print("FINAL_SCORE:0.0", flush=True)
    sys.exit(1)