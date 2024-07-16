from typing import List, Dict, Tuple
import torch
from torch.optim import Adam
from torch.nn import CrossEntropyLoss
from torch.utils.data import DataLoader, TensorDataset
from torchmetrics import Accuracy
from tqdm import tqdm
from pathlib import Path
import pandas as pd
import numpy as np
import gc
import sys
import os
import random
from glob import glob

# Import custom modules
from common import TrainingRecord, TrainingScenarios, SEED
from utils import load_json_file, append_date, dump_as_pickle, load_pickle
from training.models import models_dict, init_he_normal

# Set seeds for reproducibility
np.random.seed(SEED)
torch.manual_seed(SEED)
random.seed(SEED)
os.environ['PYTHONHASHSEED'] = str(SEED)
DEVICE = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

def prepare_dataloader(data_record, batch_size, is_train=True):
    kwargs = {'pin_memory': False}
    dataset = TensorDataset(data_record.x_train, data_record.y_train) if is_train else TensorDataset(data_record.x_val, data_record.y_val)
    return DataLoader(dataset, batch_size=batch_size, shuffle=is_train, **kwargs)

def initialize_model(config, model_name, n_dim, edge_length):
    linear_dim = 4 if n_dim == 64 else 288 if n_dim == 64*64 else 256 if n_dim == 128*128 else 0
    model = models_dict[model_name](n_dim, linear_dim) if 'CNN' in model_name else models_dict[model_name](n_dim)
    model.apply(init_he_normal)
    return model.to(DEVICE)

def run_epoch(model, loader, optimizer, criterion, accuracy_metric, is_train=True):
    epoch_loss = 0
    epoch_accuracies = []
    for x, y in loader:
        x, y = x.to(DEVICE), y.to(DEVICE)
        if 'CNN' in model.__class__.__name__:
            edge_length = int(np.sqrt(x.shape[1]))
            x = x.reshape(x.shape[0], 1, edge_length, edge_length)
        optimizer.zero_grad() if is_train else None
        output = model(x.float())
        loss = criterion(output, y)
        if is_train:
            loss.backward()
            optimizer.step()
        epoch_loss += loss.item()
        epoch_accuracies.append(accuracy_metric(torch.argmax(output, dim=1), y).item())
        del x, y, output, loss
    return epoch_loss / len(loader), np.mean(epoch_accuracies)

def train_single_model(config, model, train_loader, val_loader, lr, patience):
    criterion = CrossEntropyLoss().to(DEVICE)
    optimizer = Adam(model.parameters(), lr=lr)
    training_accuracy = Accuracy(task='binary').to(DEVICE)
    validation_accuracy = Accuracy(task='binary').to(DEVICE)

    training_losses, validation_losses = [], []
    training_accuracies, validation_accuracies = [], []

    min_loss = float('inf')
    trigger_times = 0
    save_model = type(model)().to(DEVICE)

    for epoch in range(config['epochs']):
        model.train()
        train_loss, train_acc = run_epoch(model, train_loader, optimizer, criterion, training_accuracy, is_train=True)
        model.eval()
        val_loss, val_acc = run_epoch(model, val_loader, optimizer, criterion, validation_accuracy, is_train=False)

        training_losses.append(train_loss)
        validation_losses.append(val_loss)
        training_accuracies.append(train_acc)
        validation_accuracies.append(val_acc)

        if val_loss < min_loss:
            min_loss = val_loss
            save_model.load_state_dict(model.state_dict())
        else:
            trigger_times += 1
            if trigger_times >= patience:
                print("Early stopping due to exceeded patience threshold!")
                break
        gc.collect()

    return save_model, training_losses, validation_losses, training_accuracies, validation_accuracies

def evaluate_model(model, data_record, n_dim):
    edge_length = int(np.sqrt(n_dim))
    test_data = data_record.x_test.reshape(data_record.x_test.shape[0], 1, edge_length, edge_length) if 'CNN' in model.__class__.__name__ else data_record.x_test
    test_output = model(test_data.float())
    return test_output, test_accuracy(torch.argmax(test_output, dim=1), data_record.y_test).item()

def train(config: Dict, data: List, lr: float, folder_path: str, experiment_num: int, scenarios_checkpoint: TrainingScenarios=None, restart_point: Tuple=None):
    n_dim = data[list(data.keys())[0]].x_test.shape[1]
    edge_length = int(np.sqrt(n_dim))
    scenarios = scenarios_checkpoint if scenarios_checkpoint else TrainingScenarios
    start_from_checkpoint = scenarios_checkpoint is not None
    restarted = False
    accs = {'val': pd.Series(), 'test': pd.Series()}

    for data_params, data_record in data.items():
        scenarios['training_records'][data_params] = pd.Series()
        accs['val'][data_params] = pd.Series()
        accs['test'][data_params] = pd.Series()

        train_loader = prepare_dataloader(data_record, config['batch_size'], is_train=True)
        val_loader = prepare_dataloader(data_record, config['batch_size'], is_train=False)

        for model_name in config['models']:
            if 'linear' not in data_params and 'LLR' in model_name:
                continue
            if restart_point and start_from_checkpoint:
                if model_name != restart_point[0]:
                    continue
                else:
                    start_from_checkpoint = False

            avg_acc, avg_test_acc = 0, 0
            test_accs = []
            records = []
            for run in range(config['runs_per_model']):
                if restart_point and model_name == restart_point[0] and not restarted:
                    if run < restart_point[1]:
                        continue
                    else:
                        restarted = True
                    print(f'Restarting training for {data_params} experiment {experiment_num} at {model_name} run {run + 1}')

                print(f'\nTraining {data_params} with model {model_name} (experiment {experiment_num}, run {run + 1}/{config["runs_per_model"]})')
                model = initialize_model(config, model_name, n_dim, edge_length)
                save_model, train_loss, val_loss, train_acc, val_acc = train_single_model(config, model, train_loader, val_loader, lr, config['patience'])

                test_output, test_acc = evaluate_model(save_model, data_record, n_dim)
                test_accs.append(test_acc)
                avg_test_acc += test_acc
                avg_acc += val_acc[-1]

                acc_string = f'Test Accuracy for {data_params} with model {model_name}: {test_acc} (experiment {experiment_num}, run {run + 1}/{config["runs_per_model"]})'
                print(acc_string)

                save_path = f'{folder_path}/{data_params}_{model_name}_{experiment_num}_{run}.pt'
                torch.save(save_model, save_path)

                records.append(TrainingRecord(f'{data_params}_{model_name}_{run}', save_path, save_path, train_loss, val_loss, train_acc, val_acc, test_output))
                gc.collect()

            scenarios['training_records'][data_params][model_name] = {
                'records': records,
                'avg_acc': avg_acc / config['runs_per_model'],
                'avg_test_acc': avg_test_acc / config['runs_per_model'],
                'test_accs': np.array(test_accs)
            }

            acc_string = f'Avg Accuracy for {data_params} with model {model_name} (experiment {experiment_num}, lr {lr}): {avg_acc / config["runs_per_model"]}'
            print(acc_string)
            accs['val'][data_params][model_name] = avg_acc / config['runs_per_model']
            accs['test'][data_params][model_name] = avg_test_acc / config['runs_per_model']

        dump_as_pickle(data=scenarios, output_dir=folder_path, file_name=append_date(f'{config["data_scenario"]}_training_records'))
    
    return scenarios

def main():
    config = load_json_file(file_path='training/training_config.json')

    folder_path = f'{config["output_dir"]}/{sys.argv[4]}'
    out_folder_path = f'{folder_path}/logs/{sys.argv[3]}'
    Path(f'{out_folder_path}').mkdir(parents=True, exist_ok=True)

    data_paths = glob(f'{config["data_path"]}/{sys.argv[1]}*_{sys.argv[2]}*')
    data_scenario = pd.Series()
    for data_path in data_paths:
        data = load_pickle(file_path=data_path)
        for key, value in data.items():
            data_scenario[key] = value

    if len(data_scenario) == 0:
        raise Exception(f'Scenario {sys.argv[1]} not recognized! Check the specified data_path in training_config.json and try again')

    scenarios_checkpoint = None
    restart_point = None

    scenarios = train(config=config, data=data_scenario, lr=config['lr'], folder_path=folder_path, experiment_num=int(sys.argv[3]), scenarios_checkpoint=scenarios_checkpoint, restart_point=restart_point)

if __name__ == '__main__':
    main()
