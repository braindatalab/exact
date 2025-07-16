import torch
from captum.attr import LRP

def XAI_Method(data: torch.Tensor, target: torch.Tensor, model: torch.nn.Module) -> torch.Tensor:
    """
    Diese Methode verwendet Layer-Wise Relevance Propagation (LRP) zur Erklärung.
    """
    lrp = LRP(model)
    attributions = lrp.attribute(data, target=target)
    return attributions

