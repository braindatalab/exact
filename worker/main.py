#!/usr/bin/env python3
# main.py - Worker entry point

import os
import sys
import json
import traceback

# Get environment variables
metric_type = os.getenv('metric_type', 'both')
challenge_id = os.getenv('challenge_id')
xai_method = os.getenv('xai_method')

def run_evaluation():
    """Run the appropriate evaluation based on metric_type."""
    
    if metric_type == 'emd':
        # Run only EMD
        from emd import calculate_emd_score
        try:
            mean_score, std_score, all_scores = calculate_emd_score()
            print(f"FINAL_SCORE:{mean_score}")
            return {
                "status": "success",
                "emd_score": mean_score,
                "emd_std": std_score
            }
        except Exception as e:
            print(f"ERROR: {e}")
            traceback.print_exc()
            return {"status": "error", "error": str(e)}
    
    elif metric_type == 'ima':
        # Run only IMA
        from ima import calculate_ima_score
        try:
            mean_score, std_score, all_scores = calculate_ima_score()
            print(f"FINAL_SCORE:{mean_score}")
            return {
                "status": "success",
                "ima_score": mean_score,
                "ima_std": std_score
            }
        except Exception as e:
            print(f"ERROR: {e}")
            traceback.print_exc()
            return {"status": "error", "error": str(e)}
    
    else:  # both
        # Run both metrics
        results = {}
        
        # Calculate EMD
        try:
            from emd import calculate_emd_score
            print("=== Calculating EMD ===")
            emd_mean, emd_std, emd_scores = calculate_emd_score()
            results['emd'] = {
                'mean': float(emd_mean),
                'std': float(emd_std)
            }
            print(f"EMD Mean: {emd_mean:.4f}")
            print(f"EMD Std: {emd_std:.4f}")
        except Exception as e:
            print(f"EMD ERROR: {e}")
            traceback.print_exc()
            results['emd'] = {'mean': 0.0, 'std': 0.0, 'error': str(e)}
        
        # Calculate IMA
        try:
            from ima import calculate_ima_score
            print("\n=== Calculating IMA ===")
            ima_mean, ima_std, ima_scores = calculate_ima_score()
            results['ima'] = {
                'mean': float(ima_mean),
                'std': float(ima_std)
            }
            print(f"IMA Mean: {ima_mean:.4f}")
            print(f"IMA Std: {ima_std:.4f}")
        except Exception as e:
            print(f"IMA ERROR: {e}")
            traceback.print_exc()
            results['ima'] = {'mean': 0.0, 'std': 0.0, 'error': str(e)}
        
        # Output results
        print("\n=== FINAL RESULTS ===")
        print(json.dumps(results, indent=2))
        
        # Primary score for backward compatibility
        primary_score = results.get('emd', {}).get('mean', 0.0)
        print(f"\nFINAL_SCORE:{primary_score}")
        
        return results

if __name__ == "__main__":
    print(f"Worker started with metric_type: {metric_type}")
    print(f"Challenge ID: {challenge_id}")
    
    # Run evaluation
    result = run_evaluation()
    
    # Save results to file for debugging
    with open('/tmp/worker_results.json', 'w') as f:
        json.dump({
            'challenge_id': challenge_id,
            'metric_type': metric_type,
            'result': result
        }, f, indent=2)
    
    print("\nWorker completed.")