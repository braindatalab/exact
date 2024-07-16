import numpy as np

def precision(gt_mask, attribution, k=None):
    """
    Calculate the precision of the attribution scores with respect to the ground truth mask.
    
    Args:
    gt_mask (numpy.ndarray): Ground truth mask (binary).
    attribution (numpy.ndarray): Attribution scores.
    k (int): Number of top features to consider. If None, use the number of features in the ground truth mask.
    
    Returns:
    float: Precision score.
    """
    # Flatten the input masks
    gt_mask_flat = gt_mask.flatten()
    attribution_flat = np.abs(attribution.flatten())
    
    # Number of important features in the ground truth mask
    num_important_features = np.sum(gt_mask_flat)
    
    # If k is not specified, use the number of important features in the ground truth mask
    if k is None:
        k = int(num_important_features)
    
    # Get the indices of the top k attribution scores
    top_k_indices = np.argsort(attribution_flat)[-k:]
    
    # Calculate the precision
    true_positive_count = np.sum(gt_mask_flat[top_k_indices])
    precision_score = true_positive_count / k
    
    return precision_score

if __name__ == "__main__":
    # Example usage
    gt_mask = np.array([[0, 1], [1, 0]])
    attribution = np.array([[0.2, 0.8], [0.9, 0.1]])
    print(f"Precision: {precision(gt_mask, attribution)}")
