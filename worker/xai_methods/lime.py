import torch
from captum.attr import Lime

def XAI_Method(data: torch.Tensor, target: torch.Tensor, model: torch.nn.Module) -> torch.Tensor:
    """
    Diese Methode verwendet Local Interpretable Model-agnostic Explanations (LIME) zur Erklärung.
    """
    lime = Lime(model)
    attributions = lime.attribute(data, target=target)
    return attributions
