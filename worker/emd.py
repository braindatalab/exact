# EMD code taken from /eval/eval_utils

from scipy.spatial.distance import cdist
from scipy.ndimage import gaussian_filter
import numpy as np
import torch as t
from torch import load
from upload import XAI_Method
import pickle as pkl
import numpy as np
import requests
import os

from ot.lp import emd

# normal_t = [[1,0],[1,1],[1,0]]
# normal_l = [[1,0],[1,0],[1,1]]
# combined_mask = np.zeros((8,8))
# combined_mask[1:4, 1:3] = normal_t
# combined_mask[4:7, 5:7] = normal_l
# combined_mask = combined_mask.reshape((8,8))
challenge_id = os.getenv('challenge_id')

#xai_method string made from the submitted input file (see xai_detail view and spawn_worker_container() function for more details)
xai_method = os.getenv('xai_method') 

# euclidean distance cost matrix

"""
XAI related methods and calculation of metric from the xai_tris_workflow.ipynb
"""

def create_cost_matrix(edge_length=64):
    mat = np.indices((edge_length, edge_length))
    coords = []
    for i in range(edge_length):
        for j in range(edge_length):
            coords.append((mat[0][i][j], mat[1][i][j]))
    coords = np.array(coords)
    return cdist(coords, coords)


cost_matrix_8by8 = create_cost_matrix(8)

# Scale matrix to sum to 1

def sum_to_1(mat):
    return mat / np.sum(mat)


# Calculate EMD for full, continuous-valued, attribution
# score = 1-(EMD/Dmax), where Dmax = max euclidean distance, aka sqrt(7^2 + 7^2)=9.8995 for the 8x8 data
def continuous_emd(gt_mask, attribution, n_dim=64):
    #     cost_matrix = cost_matrix_64by64
    #     if n_dim == 64:
    cost_matrix = cost_matrix_8by8

    _, log = emd(sum_to_1(gt_mask.reshape(n_dim)).astype(np.float64), sum_to_1(np.abs(
        attribution).reshape(n_dim)).astype(np.float64), cost_matrix, numItermax=200000, log=True)

    return 1 - (log['cost']/np.sqrt(n_dim + n_dim))

def final_score():
    # load set data and model
    data_file = "linear_1d1p_0.18_uncorrelated"
    data_path = "./data/" + data_file + ".pkl"
    with open(data_path, 'rb') as file:
        data = pkl.load(file)

    model_file = "linear_1d1p_0.18_uncorrelated_LLR_1_0"
    model_path = "./ai_model/" + model_file + ".pt"
    model = load(model_path)

    d = data[data_file]

    # calculate explanations and metric for the first 100 samples used in training

    batch_size = 100
    xai_scores = []

    explanations = XAI_Method(d.x_train[:batch_size].to(t.float), d.y_train[:batch_size], model)
    for i in range(batch_size):
        xai_score = continuous_emd(d.masks_train[i], explanations[i].detach().numpy())
        xai_scores.append(xai_score)


    print('mean', np.mean(xai_scores))
    print('std', np.std(xai_scores))


    emd_score = continuous_emd(d.masks_train[0], explanations[0].detach().numpy())
    return emd_score


# can be called with model file and data file as arguments
def calculate_final_score(data_file = "linear_1d1p_0.18_uncorrelated", model_file = "linear_1d1p_0.18_uncorrelated_LLR_1_0", batch_size=None):
    data_path = f"./data/{data_file}.pkl"
    model_path = f"./ai_model/{model_file}.pt"

    with open(data_path, 'rb') as file:
        data = pkl.load(file)

    model = load(model_path)
    d = data[data_file]

    if batch_size is None:
        batch_size = len(d.x_train)

    xai_scores = []

    #TODO: change to user submitted xai_method, at the moment LRP from upload.py is called
    #explanations = XAI_Method(d.x_train[:batch_size].to(t.float), d.y_train[:batch_size], model)

    # TODO check security of xai_method string - if xai_method is malicious, it can execute arbitrary code
    # Perform the conversion outside
    x_train_batch = d.x_train[:batch_size].to(t.float)
    y_train_batch = d.y_train[:batch_size]

    # Execute the XAI method definition
    exec(xai_method)

    # Evaluate the function call
    explanations = eval('XAI_Method(x_train_batch, y_train_batch, model)', {'XAI_Method': XAI_Method, 'x_train_batch': x_train_batch, 'y_train_batch': y_train_batch, 'model': model})

    
    for i in range(batch_size):
        xai_score = continuous_emd(d.masks_train[i], explanations[i].detach().numpy())
        xai_scores.append(xai_score)

    print('Mean:', np.mean(xai_scores))
    print('Std:', np.std(xai_scores))

    return np.mean(xai_scores), np.std(xai_scores)

#TODO: check xai_method string for malicious code
#TODO: change calculate_final_score() to accept xai_method from user
#TODO: use calculate_final_score() and correct parameters to calculate real score
score = final_score()
print(f"FINAL_SCORE:{score}")

post_data = {"user_id": "testid123", "challenge_id": challenge_id, "score": float(score)}
print(post_data)
