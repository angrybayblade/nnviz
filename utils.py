from json import loads,dumps

import numpy as np
import cv2
import base64
import matplotlib.pyplot as plt
import config as cfg

import tensorflow as tf

"""
Input Transformers
"""

def image2base64(image:np.ndarray,norm:bool=True)->str:
    image = ( image * ( 255 if norm else 1 ) ).astype(np.uint8)
    image = cv2.resize(image,(128,128))
    retval, buffer = cv2.imencode('.png', image)
    buffer = base64.b64encode(buffer)
    return 'data:image/png;base64,' + str(buffer,encoding="utf-8")

def prep_conv2d(value:np.ndarray,*args,**kwargs)->list:
    _,h,w,c = value.shape
    images = value.reshape(c,h,w)
    return [ image2base64(image) for image in images ]

def prep_dense(value:np.ndarray,*args,**kwargs)->list:
    return ((value.astype(float) / value.max())[0]).tolist()
    
def prepare_input_image(image:np.ndarray,input_config):
    image = image.reshape(input_config['shape'])
    return image2base64(image)

transformers = {
    "prepare_input_image":prepare_input_image
}

def prep_input_layer(value,layer:tf.keras.layers.Layer,input_config:dict,*args,**kwargs):
    return transformers[input_config['transformer']](value,input_config)
    
def prep_lstm(value:np.ndarray,layer:tf.keras.layers.Layer,*args,**kwargs):
    if layer.return_sequences:
        value,*_ = value
        _min = value.min(axis=1).reshape(-1,1)
        _max = value.max(axis=1).reshape(-1,1)
        value = ((value - _min)/(_max - _min))
        value[np.isnan(value)] = 0
        return value.astype(float).tolist()
        
    return ((value / value.max())[0]).tolist()
    
prep_functions = {
    "Conv2D":prep_conv2d,
    "Dense":prep_dense,
    "InputLayer":prep_input_layer,
    "MaxPooling2D":prep_conv2d,
    "Flatten":prep_dense,
    "LSTM":prep_lstm,
    "Concatenate":prep_dense
}

def set_levels(network,input_nodes,level):
    for node in input_nodes:
        if network[node]['level']:            
            set_levels(network,network[node]['outbound'],network[node]['level']+1)
        else:
            network[node]['level'] = level
            if len(network[node]['outbound']):
                for ob in network[node]['outbound']:
                    network[ob]['level'] = level + 1
            set_levels(network,network[node]['outbound'],network[node]['level']+1)
        

        
def get_conf(model:tf.keras.models.Model,input_config:dict):
    model_conf = loads(model.to_json())
    network = {
        l['name']:{
            "inbound":[],
            "outbound":[],
            "class_name":l['class_name'],
            "level":False
        } for l in model_conf['config']['layers']
    }

    for l in model_conf['config']['layers']:
        if len(l['inbound_nodes']):
            for n in l['inbound_nodes'][0]:
                network[l['name']]['inbound'].append(n[0])
                network[n[0]]['outbound'].append(l['name'])

    set_levels(network,input_config['input_nodes'],0)
    levels = [[] for i in range(max([i['level'] for _,i in network.items()])+1)]
    for node,val in network.items():
        levels[val['level']].append(node)

    return network,levels

def set_output(model,network:dict,levels:list,input_values:dict,input_config:dict):
    temp_out = dict()
    for level in levels:
        for layer in level:
            layer_ = network[layer]
            _layer = model.get_layer(layer)
            if len(layer_['inbound']):
                if len(layer_['inbound']) < 2:
                    inputs,*_ = [temp_out[i] for i in layer_['inbound']]
                    out = _layer(inputs)
                    temp_out[layer] = out
                    network[layer]['outputs'] = prep_functions[layer_['class_name']](
                        value=out.numpy(),
                        layer=_layer,
                        input_config=input_config
                    )
                else:
                    inputs = [temp_out[i] for i in layer_['inbound']]
                    out = _layer(inputs)
                    temp_out[layer] = out
                    network[layer]['outputs'] = prep_functions[layer_['class_name']](
                        value=out.numpy(),
                        layer=_layer,
                        input_config=input_config
                    )
            else:
                inputs = input_values[layer]
                out = _layer(inputs['value'])
                temp_out[layer] = out
                network[layer]['outputs'] = prep_functions[layer_['class_name']](
                    value=out.numpy(),
                    layer = _layer,
                    input_config = input_config[layer]
                )