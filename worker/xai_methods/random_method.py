import torch

def XAI_Method(data: torch.Tensor, target: torch.Tensor, model: torch.nn.Module) -> torch.Tensor:
    random_attributions = torch.rand(data.shape, device=data.device)
    
    return random_attributions