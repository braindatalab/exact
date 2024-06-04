# Worker Docs
- [Requirements](#requirements)
- [ai_model](#ai_model)
- [data](#data)
- [docker_utils](#docker_utils)
	- [worker_utils.py](#worker_utils.py)
- [training](#training)
	- models.py
	- train_models.py
- [Dockerfile](#Dockerfile)
- [common.py](#common.py)
- [emd.py](#emd.py)
- [upload.py](#upload.py)

## Requirements
- torch==1.8.0
- captum==0.6.0
- scikit-learn==1.0.2
- pandas==1.3.5
- matplotlib==3.4.3
- numpy==1.21.6
- pot==0.9.3
- requests==2.4.2
## *ai_model*
- **Description** Contains some trained models built using the xai_tris repository as `.pt` files

## *data*
- **Description** Contains some data sets build using the xai_tris repository as `.pkl` files

## *docker_utils*

### worker_utils.py
`spawn_container`
  - **Input** `worker_id`
  - **Output** `True`, if successful
  - **Description** Creates a docker container using the Dockerfile in the parent directory of input id

## *training*
### models.py && train_models.py
- **Description** Files from the xai_tris repository needed as dependencies for the worker script

## Dockerfile
- **Description** Installs needed libraries needed for the worker script, copies docker containers files to local machine
- **TODO** Create multiple workers with their respective id's

## common.py
- **Description** Read and parse training and data files
- **DataRecord**
	- `x_train` - training data
	- `y_train` - labels for training data
	- `x_val` - validation data set, used for final evaluation of the score
	- `y_val` - labels for validation data set
	- `x_test` - test data set, can be used by the user in order to determine correct prediction%
	- `y_test` - labels for test data set
	- `masks_train` - ground truth explanation of training set
	- `masks_val` - ground truth explanation of validation set
	- `masks_test` - ground truth explanation of test set
- **TrainingRecord**
	- `data_params` - number of data set parameters
	- `model_path` - path to Pytorch model
	- `keras_path` - path to Keras model
	- `train_loss` - loss function value for training set
	- `val_loss` - loss function value for validation set
	- `train_accuracy` - accuracy for predicting training set
	- `val_accuracy` - accuracy for predicting validation set
	- `test_preds` - accuracy for predicting test set

## emd.py
- **Description** 
	- Slightly modified evaluation script to calculate the EMD metric of uploaded XAI method form the `xai_tris_workflow.ipynb`
	- posts EMD metric score to the endpoint `/api/score/1` (hard coded) and receives response

- `final_score()`
	- **Description**
		- Calculates the EMD metric from for the hard coded data file using the hard coded trained model
		- Iterates through a fixed size (100) of samples out of the training set and returning the average of the score


## upload.py
- **Description**
	- sample upload file using a `captum.attr` XAI method
	- in principle any python file with a function precisely called `XAI_Method` which returns a `torch.Tensor` of correct shape should work properly
	- the input parameters may be extended, but otherwise should not be changed
- `XAI_Method()`
	- **Input**
		- `data` - `torch.Tensor` of shape (N, 64)
		- `target` - `torch.Tensor` of shape (1, N)
		- `model` - `torch.nn.Module`
	- **Output** `torch.tensor` of shape (N, 64)

### How to Load a Model
To load a model, ensure that you have PyTorch installed in your environment.

Import Torch and set up Torch Hub to point to this repository:
   ```python
   import torch

   model = torch.hub.load('braindatalab/exact', 'load_cnn', pretrained=False)
   ```
Possible options for models are load_cnn, load_llr, load_mlp, load_cnn8by8, load_mlp8by8. 
