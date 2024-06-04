import torch

dependencies = ['torch']

# model implementations
from worker.training.models import CNN, LLR, MLP, CNN8by8, MLP8by8

# base URL for pretrained models - we should move this somewhere else
pretrained_url_base = 'https://github.com/braindatalab/exact/tree/main/worker/ai_model/'

def load_cnn(pretrained=False, n_dim=64, linear_dim=4, *args, **kwargs):
    """
    Load the CNN model.
    Args:
        pretrained (bool): If True, loads a model pre-loaded with weights.
        n_dim (int): Dimensionality parameter for CNN.
        linear_dim (int): Dimensionality for linear layers in CNN.
    """
    model = CNN(n_dim=n_dim, linear_dim=linear_dim, *args, **kwargs)
    if pretrained:
        checkpoint = pretrained_url_base + 'cnn.pth'
        model.load_state_dict(torch.hub.load_state_dict_from_url(checkpoint))
    return model

def load_llr(pretrained=False, n_dim=64, *args, **kwargs):
    """
    Load the LLR model.
    Args:
        pretrained (bool): If True, loads a model pre-loaded with weights.
        n_dim (int): Dimensionality parameter for LLR.
    """
    model = LLR(n_dim=n_dim, *args, **kwargs)
    if pretrained:
        checkpoint = pretrained_url_base + 'llr.pth'
        model.load_state_dict(torch.hub.load_state_dict_from_url(checkpoint))
    return model

def load_mlp(pretrained=False, n_dim=64, *args, **kwargs):
    """
    Load the MLP model.
    Args:
        pretrained (bool): If True, loads a model pre-loaded with weights.
        n_dim (int): Dimensionality parameter for MLP.
    """
    model = MLP(n_dim=n_dim, *args, **kwargs)
    if pretrained:
        checkpoint = pretrained_url_base + 'mlp.pth'
        model.load_state_dict(torch.hub.load_state_dict_from_url(checkpoint))
    return model

def load_cnn8by8(pretrained=False, n_dim=64, linear_dim=4, *args, **kwargs):
    """
    Load the CNN8by8 model.
    Args:
        pretrained (bool): If True, loads a model pre-loaded with weights.
        n_dim (int): Dimensionality parameter for CNN8by8.
        linear_dim (int): Dimensionality for linear layers in CNN8by8.
    """
    model = CNN8by8(n_dim=n_dim, linear_dim=linear_dim, *args, **kwargs)
    if pretrained:
        checkpoint = pretrained_url_base + 'cnn8by8.pth'
        model.load_state_dict(torch.hub.load_state_dict_from_url(checkpoint))
    return model

def load_mlp8by8(pretrained=False, n_dim=64, *args, **kwargs):
    """
    Load the MLP8by8 model.
    Args:
        pretrained (bool): If True, loads a model pre-loaded with weights.
        n_dim (int): Dimensionality parameter for MLP8by8.
    """
    model = MLP8by8(n_dim=n_dim, *args, **kwargs)
    if pretrained:
        checkpoint = pretrained_url_base + 'mlp8by8.pth'
        model.load_state_dict(torch.hub.load_state_dict_from_url(checkpoint))
    return model
