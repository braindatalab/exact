import unittest
import numpy as np
import torch as t
from scipy.spatial.distance import cdist
from ot.lp import emd
from worker.emd import create_cost_matrix, sum_to_1, continuous_emd

class TestEMD(unittest.TestCase):

    def setUp(self):
        # Create a simple 8x8 ground truth mask and attribution
        self.n_dim = 64
        self.edge_length = int(np.sqrt(self.n_dim))
        self.gt_mask = np.zeros((self.edge_length, self.edge_length))
        self.attribution = np.zeros((self.edge_length, self.edge_length))
        
        # Set some values to make the masks non-trivial
        self.gt_mask[1:4, 1:3] = np.array([[1, 0], [1, 1], [1, 0]])
        self.attribution[4:7, 5:7] = np.array([[1, 0], [1, 0], [1, 1]])
        
        self.gt_mask = self.gt_mask.reshape((self.edge_length, self.edge_length))
        self.attribution = self.attribution.reshape((self.edge_length, self.edge_length))
        
        self.cost_matrix = create_cost_matrix(self.edge_length)

    def test_cost_matrix(self):
        # Test the shape and values of the cost matrix
        self.assertEqual(self.cost_matrix.shape, (self.n_dim, self.n_dim))
        self.assertTrue(np.all(self.cost_matrix >= 0))

    def test_sum_to_1(self):
        # Test normalization function
        normalized_gt_mask = sum_to_1(self.gt_mask)
        normalized_attribution = sum_to_1(self.attribution)
        
        self.assertAlmostEqual(np.sum(normalized_gt_mask), 1.0, places=5)
        self.assertAlmostEqual(np.sum(normalized_attribution), 1.0, places=5)

    def test_emd(self):
        # Calculate EMD using the continuous_emd function
        score = continuous_emd(self.gt_mask, self.attribution, self.n_dim)
        
        # Manually calculate EMD for comparison
        normalized_gt_mask = sum_to_1(self.gt_mask.reshape(self.n_dim)).astype(np.float64)
        normalized_attribution = sum_to_1(np.abs(self.attribution).reshape(self.n_dim)).astype(np.float64)
        
        _, log = emd(normalized_gt_mask, normalized_attribution, self.cost_matrix, numItermax=200000, log=True)
        manual_score = 1 - (log['cost'] / np.sqrt(self.n_dim + self.n_dim))

        # Assert that both scores are almost equal
        self.assertAlmostEqual(score, manual_score, places=5)

if __name__ == '__main__':
    unittest.main()
