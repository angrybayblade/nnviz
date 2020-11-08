import numpy as np
import cv2
import base64
import matplotlib.pyplot as plt

import tensorflow as tf

from json import loads,dumps
from tensorflow.keras.layers import *

def set_levels(network,input_nodes,level):
    for node in input_nodes:
        if network[node]['level'] > -1:            
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
            "level":-1,
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
    
    for i,level in enumerate(levels):
        if not len(level):
            j = i - 1
            while j:
                if len(levels[j]) > 1:
                    levels[i] = levels[j][1:]
                    levels[j] = levels[j][:1]
                    break
                j -= 1
                
    return network,levels

def image2base64(image:np.ndarray)->str:
    image = image.astype(np.uint8) if image.max() > 1 else (image * 255).astype(np.uint8)
    retval, buffer = cv2.imencode('.png', image)
    buffer = base64.b64encode(buffer)
    return 'data:image/png;base64,' + str(buffer,encoding="utf-8")

def prepare_input_image(image:np.ndarray,layer:dict,input_config:dict):
    try:
        image = image.reshape(input_config['shape'])
        image = cv2.resize(image,(128,128))
    except ValueError:
        _,*shape = layer['instance'].output_shape
        image = image.reshape(shape)
    if len(image.shape) == 3:
        return image2base64(image[:,:,::-1])
    return image2base64(image)

transformers = {
    "prepare_input_image":prepare_input_image
}

def prep_dummy(value:np.ndarray,layer:Layer,*args,**kwargs):
    pass

def prep_input_layer(
        value:np.ndarray,
        layer:dict,
        input_config:dict,
        *args,
        **kwargs
    )->list:
    """
    Prep Function For InputLayer 
    """
    func = transformers[input_config[layer['name']]['transformer']]
    return func(value.numpy(),layer,input_config[layer['name']])

def prep_dense(
        value:np.ndarray,
        *args,
        **kwargs
    )->list:
    """
    Prep Function For Dense Layer
    """
    (value,) = value.numpy()
    return ((value.astype(float) / value.max())).tolist()

def prep_activation(
        value:np.ndarray,
        layer:Layer,
        *args,
        **kwargs
    )->list:
    pass

def prep_lstm(value:np.ndarray,layer:tf.keras.layers.Layer,*args,**kwargs):
    if layer.return_sequences:
        value,*_ = value
        _min = value.min(axis=1).reshape(-1,1)
        _max = value.max(axis=1).reshape(-1,1)
        value = ((value - _min)/(_max - _min))
        value[np.isnan(value)] = 0
        return value.astype(float).tolist()
        
    return ((value / value.max())[0]).tolist()


def prep_conv2d(
        value:np.ndarray,
        *args,
        **kwargs
    )->list:
    """
    Prep function for Conv2D layer
    """
    value = value.numpy()
    _,h,w,c = value.shape
    images = value.reshape(c,h*w).copy()
    _min =  images.min(axis=1).reshape(-1,1)
    _max =  images.max(axis=1).reshape(-1,1)
    images = (((images - _min) / (_max - _min)).reshape(c,h,w)*255).astype(np.uint8)
    images[np.isnan(images)] = 0
    _max = images.max()
    _max = _max if _max else 1
    return [ (image2base64(image),float(image.mean()/_max)) for image in images ]

def get_outputs(
        tensor,
        layer,
        input_config,
        network,
        model
    ):
    func = prep_functions[layer['config']['class_name']]
    outputs = func(
        value=tensor,
        layer=layer,
        network=network,
        input_config=input_config,
        model=model
    )
    return outputs


def prep_ext_layer(
        value:np.ndarray,
        layer:dict,
        network:dict,
        input_config:dict,
        model,
        *args,**kwargs
    ):
    (parent,*_) = network[layer['name']]['inbound']
    layer = {
        "name":parent,
        "config":network[parent],
        "instance":layer['instance']
    }
    if network[parent]['class_name'] == 'InputLayer':
        return [get_outputs(value,layer,input_config,network,model)]
    return get_outputs(value,layer,input_config,network,model)

prep_functions = {
    "Conv2D":prep_conv2d,
    "Dense":prep_dense,
    "InputLayer":prep_input_layer,
    "MaxPooling2D":prep_conv2d,
    "Flatten":prep_dense,
    "LSTM":prep_lstm,
    
    "Concatenate":prep_ext_layer,
    "Activation":prep_ext_layer,
    "Add":prep_ext_layer,
    "BatchNormalization":prep_ext_layer,
    "ZeroPadding2D":prep_ext_layer
}

def set_output(model,network:dict,levels:list,input_values:dict,render_config:dict):
    temp_out = dict()
    inputs = None
    layer = None
    layer_instance = None
    layer_config = None
    
    for level in levels:
        for layer in level:
            layer_config = network[layer]
            layer_instance = model.get_layer(layer)
            inputs = None
            if len(layer_config['inbound']):
                if len(layer_config['inbound']) < 2:
                    inputs,*_ = [temp_out[i] for i in layer_config['inbound']]
                else:
                    inputs = [temp_out[i] for i in layer_config['inbound']]
                    
                out = layer_instance(inputs)
                temp_out[layer] = out
                network[layer]['outputs'] = get_outputs(
                    tensor=out,
                    layer={
                        "name":layer,
                        "config":layer_config,
                        "instance":layer_instance
                    },
                    input_config=render_config,
                    network=network,
                    model=model
                )
            else:
                inputs = input_values['inputs'][layer]
                out = layer_instance(inputs)
                temp_out[layer] = out
                func = prep_functions[layer_config['class_name']]
                network[layer]['outputs'] = func(
                    value=out,
                    layer ={
                        "name":layer,
                        "config":layer_config,
                        "instance":layer_instance
                    },
                    input_config = render_config,
                    network=network,
                    model=model
                )