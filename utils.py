from json import loads,dumps

import numpy as np
import cv2
import base64
import matplotlib.pyplot as plt
import config as cfg

"""
Input Transformers
"""

def image2base64(image:np.ndarray,norm:bool=True)->str:
    image = ( image * ( 255 if norm else 1 ) ).astype(np.uint8)
    retval, buffer = cv2.imencode('.png', image)
    buffer = base64.b64encode(buffer)
    return 'data:image/png;base64,' + str(buffer,encoding="utf-8")

def prep_conv2d(output:np.ndarray)->list:
    _,h,w,c = output.shape
    images = output.reshape(c,h,w)
    return [ image2base64(image) for image in images ]

def prep_dense(output:np.ndarray)->list:
    return list((output.astype(float) / output.max())[0])


# transformer  
def prepare_input_image(image:np.ndarray,input_config):
    image = image.reshape(input_config['shape'])
    image = cv2.resize(image,(128,128))
    return image2base64(image)

transformers = {
    "prepare_input_image":prepare_input_image
}


def prep_input_layer(value,layer,input_config):
    return transformers[input_config['transformer']](value,input_config)


prep_functions = {
    "Conv2D":prep_conv2d,
    "Dense":prep_dense,
    "InputLayer":prep_input_layer,
    "MaxPooling2D":prep_conv2d,
    "Flatten":prep_dense
}

def set_levels(network:dict,inputNodes:list,currentLevel:int=0):
    for node in inputNodes:
        network[node]['level'] = currentLevel
        set_levels(network,network[node]['outbound'],currentLevel+1)

def get_network_conf(model,input_nodes:list):
    model_conf = loads(model.to_json())
    network = {
        l['name']:{
            "inbound":[],
            "outbound":[],
            "class_name":l['class_name']
        } for l in model_conf['config']['layers']
    }
    
    for l in model_conf['config']['layers']:
        if len(l['inbound_nodes']):
            for n in l['inbound_nodes'][0]:
                network[l['name']]['inbound'].append(n[0])
                network[n[0]]['outbound'].append(l['name'])

    set_levels(network,input_nodes,0)
    levels = [[] for i in range(max([i['level'] for _,i in network.items()])+1)]
    for node,val in network.items():
        levels[val['level']].append(node)
    return network,levels

def set_output(model,network:dict,levels:list,input_values:dict,input_config:dict):
    temp_out = dict()
    for level in levels:
        for layer in level:
            layer_ = network[layer]
            if len(layer_['inbound']):
                if len(layer_['inbound']) < 2:
                    inputs,*_ = [temp_out[i] for i in layer_['inbound']]
                    out = model.get_layer(layer)(inputs)
                    temp_out[layer] = out
                    network[layer]['outputs'] = prep_functions[layer_['class_name']](out.numpy())
                else:
                    inputs = [temp_out[i] for i in layer_['inbound']]
                    out = model.get_layer(layer)(inputs)
                    temp_out[layer] = out
                    network[layer]['outputs'] = prep_functions[layer_['class_name']](out.numpy())
            else:
                inputs = input_values[layer]
                out = model.get_layer(layer)(inputs['value'])
                temp_out[layer] = out
                network[layer]['outputs'] = prep_functions[layer_['class_name']](out.numpy(),model.get_layer(layer),input_config[layer])
