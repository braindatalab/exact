import torch
import os

# Configuration to specify source: 'local' for local directory, 'github' for GitHub repository
source = 'github'  # Change to 'github' to load from GitHub
repo_path = 'braindatalab/exact' # GitHub repository path

# change to the base directory so hubconf.py can be found
current_dir = os.getcwd()
base_dir = os.path.join(current_dir, '../../')
os.chdir(base_dir)

# List of model loading functions as defined in hubconf.py
model_functions = ['load_cnn', 'load_llr', 'load_mlp', 'load_cnn8by8', 'load_mlp8by8']

# Try to load each model and print a confirmation message
for model_func in model_functions:
    try:
        if source == 'local':
            # Load the model using the local path
            model = torch.hub.load('.', model_func, source='local', pretrained=False)
        elif source == 'github':
            # Load the model from a GitHub repository
            model = torch.hub.load(repo_path, model_func, pretrained=False)
        
        # Print the model to verify it loads correctly
        print(f"{model_func} loaded successfully. Model details: {model}")
    except Exception as e:
        print(f"Failed to load {model_func}. Error: {e}")

