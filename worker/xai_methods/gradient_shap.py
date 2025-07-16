import torch
from captum.attr import GradientShap


def XAI_Method(data: torch.Tensor, target: torch.Tensor, model: torch.nn.Module) -> torch.Tensor:
    """
    Diese Methode verwendet GradientSHAP zur Erklärung.
    """
    shap = GradientShap(model)
    
    # GradientSHAP benötigt eine Referenz oder "Baseline". Ein Null-Tensor ist eine übliche Wahl.
    baseline = torch.zeros_like(data)
    
    attributions = shap.attribute(data, baselines=baseline, target=target)
    return attributions
