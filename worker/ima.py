import numpy as np

def importance_mass_accuracy(gt_mask, attribution):
    """
    Calculate the Importance Mass Accuracy (IMA) of the attribution scores with respect to the ground truth mask.
    
    Args:
    gt_mask (numpy.ndarray): Ground truth mask (binary).
    attribution (numpy.ndarray): Attribution scores.
    
    Returns:
    float: Importance Mass Accuracy score.
    """
    # Flatten the input masks
    gt_mask_flat = gt_mask.flatten()
    attribution_flat = np.abs(attribution.flatten())
    
    # Sum of the attribution scores in the ground truth mask
    importance_in_gt = np.sum(attribution_flat[gt_mask_flat == 1])
    
    # Total sum of the attribution scores
    total_importance = np.sum(attribution_flat)
    
    # Calculate IMA
    ima_score = importance_in_gt / total_importance
    
    return ima_score

if __name__ == "__main__":
    # Example usage
    gt_mask = np.array([[0, 1], [1, 0]])
    attribution = np.array([[0.2, 0.8], [0.9, 0.1]])
    print(f"Importance Mass Accuracy: {importance_mass_accuracy(gt_mask, attribution)}")
