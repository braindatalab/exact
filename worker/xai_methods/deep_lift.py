import torch
from captum.attr import DeepLift

def XAI_Method(data: torch.Tensor, target: torch.Tensor, model: torch.nn.Module) -> torch.Tensor:
    """
    Diese Methode verwendet DeepLIFT zur Erklärung.
    """
    dl = DeepLift(model)
    attributions = dl.attribute(data, target=target)
    return attributions

