import numpy as np
import matplotlib.pyplot as plt
plt.style.use('seaborn-colorblind')

import pickle as pkl

import torch

from utils import load_json_file
from pathlib import Path

import matplotlib.gridspec as gridspec

from glob import glob

from torch import load
import gc

# n_dim = 64**2
normal_t = [[1,0],[1,1],[1,0]]
normal_l = [[1,0],[1,0],[1,1]]
combined_mask = np.zeros((8,8))
combined_mask[1:4, 1:3] = normal_t
combined_mask[4:7, 5:7] = normal_l
combined_mask = combined_mask.reshape((8,8))

combined_mask_pat_scaled = np.kron(combined_mask, np.ones((8,8)))

from scipy.ndimage import gaussian_filter
combined_mask_smoothed = gaussian_filter(combined_mask_pat_scaled, 1.5)
combined_mask_binary = combined_mask_smoothed.copy()
combined_mask_binary[combined_mask_binary>=0.05]=1
combined_mask_binary[combined_mask_binary<0.05]=0

def get_local_plot_data(data, xai_output, model_num=0,plot_inds=[0,1,2,3,4], method_names=['Gradient SHAP', 'LIME', 'LRP', 'Integrated Gradients'], baselines=['laplace', 'rand']):
    all_plots = []
    for plot_ind in plot_inds:
        plot_data = {}
        for scenario, scenario_xai_results in xai_output.items():
            plot_data[scenario] = dict()
            plot_data[scenario]['Data'] = data[scenario].x_test[plot_ind].detach().numpy()
            plot_data[scenario]['Ground Truth'] = data[scenario].masks_test[plot_ind]
            for model_name in ['LLR', 'MLP', 'CNN']:
                if model_name == 'LLR' and 'linear' not in scenario:
                    continue
                plot_data[scenario][model_name] = list()
                for method_name in method_names:
                    attr = xai_output[scenario][model_name][model_num][method_name][plot_ind]
                    plot_data[scenario][model_name].append(attr)
            
            for baseline in baselines:
                plot_data[scenario][baseline] = xai_output[scenario][baseline][plot_ind]
        all_plots.append(plot_data)
    return all_plots


def get_global_plot_data(data, xai_output, correct_inds, test_size, method_names=['Gradient SHAP', 'LIME', 'LRP', 'Integrated Gradients'], baselines=['laplace', 'x']):
    plot_data = {}
    i = 0
    for scenario, scenario_xai_results in xai_output.items():
        if 'translations' in scenario:
            continue

        plot_inds = correct_inds[i][:test_size]
        print(plot_inds)
        plot_data[scenario] = dict()
        plot_data[scenario]['Data'] = data[scenario].x_test[correct_inds[i]].detach().numpy()
        plot_data[scenario]['Ground Truth'] = data[scenario].masks_test[correct_inds[i]]
        for model_name in ['LLR', 'MLP', 'CNN']:
            if model_name == 'LLR' and 'linear' not in scenario:
                continue
            plot_data[scenario][model_name] = list()
            for method_name in method_names:
                method_data = []
                for j in range(len(xai_output[scenario][model_name])):
                    attr = xai_output[scenario][model_name][j][method_name][plot_inds]
                    method_data.append(attr)
                plot_data[scenario][model_name].append(np.mean(method_data, axis=0))
        
        for baseline in baselines:
            # print(xai_output[scenario][baseline])
            # print(xai_output[scenario][baseline].shape)
            if baseline == 'x':
                print(xai_output[scenario][baseline])
                print(xai_output[scenario][baseline].shape)
                plot_data[scenario][baseline] = xai_output[scenario][baseline][:test_size][plot_inds]
            else:
                plot_data[scenario][baseline] = xai_output[scenario][baseline][plot_inds]
        
        i+=1
    return plot_data


def scen_key_mapping(scen_key):
    scen_dict = {'linear': 'LIN', 'multiplicative': 'MULT', 'translations': 'RIGID','xor': 'XOR'}
    bg_dict = {'uncorrelated': 'WHITE', 'correlated': 'CORR', 'imagenet': 'IMAGENET'}
    components = scen_key.split('_')

    return scen_dict[components[0]] + '\n' +  bg_dict[components[-1]]


def qualitative_results_landscape(all_plots, figsize=(17,14), edge_length=64, out_dir='./figures'):
    for plot_ind, plot_data in enumerate(all_plots):
        f = plt.figure(figsize=figsize)
        gs = gridspec.GridSpec(1,6, hspace=0.01, wspace=0.05, width_ratios=[0.65,1,1,1,1,0.32]) # Grid of [ [data, ground truth], [method for each model] * 5, [baselines] ]

        w_space = 0.075
        h_space = 0.01

        data_gs = gridspec.GridSpecFromSubplotSpec(12, 2, subplot_spec=gs[0], hspace=h_space, wspace=w_space)

        shap_gs = gridspec.GridSpecFromSubplotSpec(12, 3, subplot_spec=gs[1], hspace=h_space, wspace=w_space)
        lime_gs = gridspec.GridSpecFromSubplotSpec(12, 3, subplot_spec=gs[2], hspace=h_space, wspace=w_space)
        lrp_gs = gridspec.GridSpecFromSubplotSpec(12, 3, subplot_spec=gs[3], hspace=h_space, wspace=w_space)
        pn_gs = gridspec.GridSpecFromSubplotSpec(12, 3, subplot_spec=gs[4], hspace=h_space, wspace=w_space)

        method_gs = {'Gradient SHAP': shap_gs, 'LIME': lime_gs, 'LRP': lrp_gs, 'Integrated Gradients': pn_gs}

        baselines_gs = gridspec.GridSpecFromSubplotSpec(12, 1, subplot_spec=gs[5], hspace=h_space, wspace=w_space)

        i = 0
        for scenario, scen_data in plot_data.items():
            data_ax = f.add_subplot(data_gs[i,0])
            data_ax.imshow(np.reshape(scen_data['Data'],(edge_length,edge_length)), cmap="RdBu_r", vmin=-1, vmax=1)
            data_ax.set_xticks([])
            data_ax.set_yticks([])
            data_ax.set_ylabel(scen_key_mapping(scenario).replace(" ", "\n"), fontdict = {'fontsize' : 12})
            
            gt_ax = f.add_subplot(data_gs[i,1])
            gt_data = np.abs(scen_data['Ground Truth'])
            if edge_length == 64:
                gt_data[gt_data >= 0.05] = 1
                gt_data[gt_data < 0.05] = 0
            if i < 6:
                if edge_length == 64:
                    gt_data = combined_mask_binary
                else:
                    gt_data = combined_mask
            gt_ax.imshow(np.reshape(gt_data,(edge_length,edge_length)), cmap="magma", vmin=0, vmax=1)
            gt_ax.set_xticks([])
            gt_ax.set_yticks([])
            
            for j, model_name in enumerate(['LLR', 'MLP', 'CNN']):
                method_ind = 0
                for method, grid_spec in method_gs.items():
                    ax = f.add_subplot(grid_spec[i,j])
                    if model_name == 'LLR' and 'linear' not in scenario:
                        ax.yaxis.set_visible(False)
                        plt.setp(ax.spines.values(), visible=False)
                        ax.tick_params(top=False, labelbottom=False, bottom=False)
                        ax.patch.set_visible(False)
                        if i==11:
                            ax.set_xlabel(model_name, fontdict = {'fontsize' : 12})
                            ax.xaxis.set_label_coords(0.5,0.0)
                    else:
                        ax.imshow(np.reshape(np.abs(scen_data[model_name][method_ind]),(edge_length,edge_length)), cmap="magma")
                        ax.set_xticks([])
                        ax.set_yticks([])
                        
                    if i == 0 and j==1:
                        label = method
                        if method == 'pattern.net':
                            label = 'PatternNet'
                        ax.set_xlabel(label, fontdict = {'fontsize' : 12})
                        ax.xaxis.set_label_position('top')
                    
                    if i==11:
                        ax.set_xlabel(model_name, fontdict = {'fontsize' : 12})                        
                    
                    method_ind += 1
            
            lapl_ax = f.add_subplot(baselines_gs[i,0])
            lapl_ax.imshow(np.reshape(np.abs(scen_data['laplace']),(edge_length,edge_length)), cmap="magma")
            lapl_ax.set_xticks([])
            lapl_ax.set_yticks([])
            
            if i == 0:
                data_ax.set_xlabel('Data', fontdict = {'fontsize' : 12})
                data_ax.xaxis.set_label_position('top')
                gt_ax.set_xlabel('Ground\nTruth', fontdict = {'fontsize' : 12})
                gt_ax.xaxis.set_label_position('top')
                lapl_ax.set_xlabel('Laplace', fontdict = {'fontsize' : 12})
                lapl_ax.xaxis.set_label_position('top')
            
            i+=1

        plt.savefig(f'{out_dir}/qualitative_results_landscape_{plot_ind}.png', bbox_inches="tight")
        plt.savefig(f'{out_dir}/qualitative_results_landscape_hires_{plot_ind}.png', bbox_inches="tight", dpi=300)


def global_results(plot_data, figsize=(8.5,14), edge_length=64, out_dir='./figures'):
    f = plt.figure(figsize=figsize)
    gs = gridspec.GridSpec(6, 1, wspace=0.01, hspace=0.1, height_ratios=[0.315,1,1,1,1,0.65]) # Grid of [ [data, ground truth], [method for each model] * 5, [baselines] ]

    h_space = 0.075
    w_space = 0.01

    data_gs = gridspec.GridSpecFromSubplotSpec(1, 9, subplot_spec=gs[0], hspace=h_space, wspace=w_space)

    shap_gs = gridspec.GridSpecFromSubplotSpec(3, 9, subplot_spec=gs[1], hspace=h_space, wspace=w_space)
    lime_gs = gridspec.GridSpecFromSubplotSpec(3, 9, subplot_spec=gs[2], hspace=h_space, wspace=w_space)
    lrp_gs = gridspec.GridSpecFromSubplotSpec(3, 9, subplot_spec=gs[3], hspace=h_space, wspace=w_space)
    pn_gs = gridspec.GridSpecFromSubplotSpec(3, 9, subplot_spec=gs[4], hspace=h_space, wspace=w_space)

    method_gs = {'Gradient SHAP': shap_gs, 'LIME': lime_gs, 'LRP': lrp_gs, 'Integrated Gradients': pn_gs}

    baselines_gs = gridspec.GridSpecFromSubplotSpec(2, 9, subplot_spec=gs[5], hspace=h_space, wspace=w_space)

    i = 0

    if edge_length == 64:
        gt_data = combined_mask_binary
    else:
        gt_data = combined_mask

    for scenario, scen_data in plot_data.items():
        gt_ax = f.add_subplot(data_gs[0,i])
        gt_ax.imshow(np.reshape(gt_data,(edge_length,edge_length)), cmap="magma", vmin=0, vmax=1)
        gt_ax.set_xticks([])
        gt_ax.set_yticks([])
        gt_ax.set_xlabel(scen_key_mapping(scenario).replace(" ", "\n"), fontdict = {'fontsize' : 12})
        gt_ax.xaxis.set_label_position('top')
        
        for j, model_name in enumerate(['LLR', 'MLP', 'CNN']):
            method_ind = 0
            for method, grid_spec in method_gs.items():
                ax = f.add_subplot(grid_spec[j,i])
                if model_name == 'LLR' and 'linear' not in scenario:
                    ax.xaxis.set_visible(False)
                    plt.setp(ax.spines.values(), visible=False)
                    ax.tick_params(left=False, labelleft=False, right=False)
                    ax.patch.set_visible(False)
                    if i==8:
                        ax.set_ylabel(model_name, rotation=90, fontsize=12)
                        ax.yaxis.set_label_position("right")
                        ax.yaxis.set_label_coords(1.0,0.5)
                else:
                    ax.imshow(np.reshape(np.abs(np.mean(scen_data[model_name][method_ind], axis=0)),(edge_length,edge_length)), cmap="magma")
                    ax.set_xticks([])
                    ax.set_yticks([])
                    
                if i == 0 and j==1:
                    label = method
                    if method == 'pattern.net':
                        label = 'PatternNet'
                    ax.set_ylabel(label.replace(' ', '\n'), fontdict = {'fontsize' : 12})
                    
                if i==8 and model_name != 'LLR':
                    ax.set_ylabel(model_name, rotation=90, fontsize=12)
                    ax.yaxis.set_label_position("right")

                method_ind += 1
        
        lapl_ax = f.add_subplot(baselines_gs[0,i])
        lapl_ax.imshow(np.reshape(np.abs(np.mean(scen_data['laplace'], axis=0)),(edge_length,edge_length)), cmap="magma")
        lapl_ax.set_xticks([])
        lapl_ax.set_yticks([])

        rand_ax = f.add_subplot(baselines_gs[1,i])
        rand_ax.imshow(np.reshape(np.abs(np.mean(scen_data['x'], axis=0)),(edge_length,edge_length)), cmap="magma")
        rand_ax.set_xticks([])
        rand_ax.set_yticks([])
        
        if i == 0:
            gt_ax.set_ylabel('Ground\nTruth', fontdict = {'fontsize' : 12})
            lapl_ax.set_ylabel('Laplace', fontdict = {'fontsize' : 12})
            rand_ax.set_ylabel('x', fontdict = {'fontsize' : 12})
            
        i+=1

    plt.savefig(f'{out_dir}/qualitative_global_results.png', bbox_inches="tight")
    plt.savefig(f'{out_dir}/qualitative_global_results_hires.png', bbox_inches="tight", dpi=300)


def main():
    print('loading config')
    config = load_json_file(file_path='eval/eval_config.json')

    data = {}
    xai_results = {}
    inds_list = []
    correct_inds = []

    for scenario in ['linear', 'multiplicative', 'translations_rotations', 'xor']:
        for background in ['uncorrelated', 'correlated', 'imagenet']: 
            data_paths = glob(f'{config["data_path"]}/{scenario}*{background}.pkl')
            if data_paths == []:
                continue
            data_key = ''
            for data_path in data_paths:
                with open(data_path, 'rb') as file:
                    scen_data = pkl.load(file)
                for key, val in scen_data.items():
                    data[key] = val
                    data_key = key

            with open(f'{config["xai_path"]}/{scenario}_{background}_xai_records.pkl', 'rb') as file:
                xai_output = pkl.load(file)

            for key, val in xai_output.items():
                xai_results[key] = val

            with open(f'{config["out_dir"]}/{scenario}_{background}_quantitative_results.pkl', 'rb') as file:
                quantitative_results = pkl.load(file)
            
            correct_inds.append(quantitative_results['intersections'])

            torch_model_paths = glob(f'{config["training_path"]}/{scenario}*_{background}*_0_*.pt')

            for model_name in ['LLR', 'MLP', 'CNN']:
                if model_name == 'LLR' and 'linear' not in scenario:
                    continue
                # Torch
                for model_path in torch_model_paths:
                    if model_name in model_path:
                        model = load(model_path, map_location=torch.device('cpu'))
                        test_data_torch = data[data_key].x_test
                        edge_length = int(np.sqrt(test_data_torch.shape[1]))
                        if model_name == 'CNN':
                            test_data_torch = test_data_torch.reshape(test_data_torch.shape[0], 1, edge_length, edge_length)
                        #print(model_name, test_data_torch.shape)
                        torch_otpt = model(test_data_torch.float())
                        torch_inds = data[data_key].y_test.detach().numpy() == np.argmax(torch_otpt.detach().numpy(), axis=1)
                        inds_list.append(torch_inds)
                        del model
                        gc.collect()
    
    intersection = np.logical_and.reduce(inds_list)
    print(intersection)

    # choose an index to plot or give a list of indexes, comment below intersection = to get the above
    #  intersection of correctly predicted test samples to plot across all scenarios
    rand_idx = 0
    intersection = [rand_idx]

    out_folder_path = f'{config["out_dir"]}/figures'
    Path(f'{out_folder_path}').mkdir(parents=True, exist_ok=True)

    plot_data_local = get_local_plot_data(data, xai_results, model_num=0, plot_inds=intersection,
                                    method_names=['Gradient SHAP', 'LIME', 'LRP', 'Integrated Gradients'],
                                    baselines=['laplace', 'rand'],                      
                )
    
    qualitative_results_landscape(plot_data_local, edge_length=edge_length, out_dir=out_folder_path)

    global_plot_data = get_global_plot_data(data, xai_results, np.invert(correct_inds), config['test_size'])
    global_results(global_plot_data, edge_length=edge_length, out_dir=out_folder_path)
    return 

if __name__ == '__main__':
    main()