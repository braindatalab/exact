import torch
from captum.attr import GradientShap, Lime, LRP, IntegratedGradients, DeepLift
import pickle as pkl
from torch import load


# load the generated tetris data


# train data of shape (N,64)

def XAI_Method(data: torch.Tensor, target: torch.Tensor, model: torch.nn.Module) -> torch.tensor:
    return LRP(model).attribute(data, target=target)


# apply the XAI method to the train data
def apply_gradient_shap(data: torch.Tensor, target: torch.Tensor, model: torch.nn.Module):
    shap = GradientShap(model)
    baseline = torch.zeros_like(data)
    return shap.attribute(data, baselines=baseline, target=target)

def apply_lime(data: torch.Tensor, target: torch.Tensor, model: torch.nn.Module):
    lime = Lime(model)
    return lime.attribute(data, target=target)

def apply_lrp(data: torch.Tensor, target: torch.Tensor, model: torch.nn.Module):
    lrp = LRP(model)
    return lrp.attribute(data, target=target)

def apply_integrated_gradients(data: torch.Tensor, target: torch.Tensor, model: torch.nn.Module):
    ig = IntegratedGradients(model)
    return ig.attribute(data, target=target)

def apply_deep_lift(data: torch.Tensor, target: torch.Tensor, model: torch.nn.Module):
    dl = DeepLift(model)
    return dl.attribute(data, target=target)


# train prediction labels of shape (N)
# y_train = data[data_file].y_train

# test data
# x_test = data[data_file].x_test

# test prediction labels
# y_test = data[data_file].y_test

# train explanation ground truth masks of shape (N, 64)
# masks_train = data[data_file].masks_train.shape

# load model

# taken from /xai/methods.py

# Each explanation takes:
# data: shape as was put into model (N,64)
# target: prediction target shape (N)
# model: trained model .pt object
# and optionally (here for GradSHAP and LIME, not for LRP)



# calculate explanations for a batch, as seen in /xai/methods.py
# alternatively do this for the whole dataset (this can be very slow!!)



# producing the EMD score for LRP explanation of sample zero
# emd_score = continuous_emd(data[data_file].masks_train[0],
#                            lrp_explanations[0].detach().numpy())



