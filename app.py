from flask import Flask,request
from flask_cors import CORS
from json import loads,dumps

import numpy as np
import cv2
import base64
import matplotlib.pyplot as plt
import config as cfg


app = Flask(__name__)
CORS(app=app)

"""
Input Transformers
"""

def image2base64(image:np.ndarray,norm:bool=True)->str:
    image = ( image * ( 255 if norm else 1 ) ).astype(np.uint8)
    cv2.imwrite("./temp.png",image)
    bytesIO = open("./temp.png","rb")
    return 'data:image/png;base64,' + str(base64.b64encode(bytesIO.read()),encoding="utf-8")

def prepareInputImage(image:np.ndarray,input_config):
    image = image.reshape(input_config['shape'])
    image = cv2.resize(image,(128,128))
    return image2base64(image)

transformers = {
    "prepareInputImage":prepareInputImage
}

def setLevels(network:dict,inputNodes:list,currentLevel:int=0):
    for node in inputNodes:
        network[node]['level'] = currentLevel
        setLevels(network,network[node]['outbound'],currentLevel+1)

def getNetworkConf(model,inputNodes:list):
    modelConf = loads(model.to_json())
    network = {
        l['name']:{
            "inbound":[],
            "outbound":[],
            "class_name":l['class_name']
        } for l in modelConf['config']['layers']
    }

    for l in modelConf['config']['layers']:
        if len(l['inbound_nodes']):
            for n in l['inbound_nodes'][0]:
                network[l['name']]['inbound'].append(n[0])
                network[n[0]]['outbound'].append(l['name'])
                
    setLevels(network,inputNodes,0)
    levels = [[] for i in range(max([i['level'] for _,i in network.items()])+1)]
    for node,val in network.items():
        levels[val['level']].append(node)
    return network,levels



def prepConv2D(output:np.ndarray)->list:
    _,h,w,c = output.shape
    images = output.reshape(c,h,w)
    return [  image2base64(image) for image in images ]

def prepDense(output:np.ndarray)->list:
    return list((output.astype(float) / output.max())[0])
    
def prepInputLayer(image,layer):
    layer = layer.get_config()
    input_config  = cfg.input_config['layer_config'][layer['name']]
    return transformers.get(input_config.get('transformer'))(image,input_config)
    
prepFunctions = {
    "Conv2D":prepConv2D,
    "Dense":prepDense,
    "InputLayer":prepInputLayer,
    "MaxPooling2D":prepConv2D,
    "Flatten":prepDense
}

def setOutput(model,network:dict,levels:list,input_values:dict):
    tempOut = dict()
    for level in levels:
        for layer in level:
            layer_ = network[layer]
            if len(layer_['inbound']):
                if len(layer_['inbound']) < 2:
                    inputs,*_ = [tempOut[i] for i in layer_['inbound']]
                    out = model.get_layer(layer)(inputs)
                    tempOut[layer] = out
                    network[layer]['outputs'] = prepFunctions[layer_['class_name']](out.numpy())
                else:
                    inputs = [tempOut[i] for i in layer_['inbound']]
                    out = model.get_layer(layer)(inputs)
                    tempOut[layer] = out
                    network[layer]['outputs'] = prepFunctions[layer_['class_name']](out.numpy())
            else:
                inputs = input_values[layer]
                out = model.get_layer(layer)(inputs)
                tempOut[layer] = out
                network[layer]['outputs'] = prepFunctions[layer_['class_name']](out.numpy(),model.get_layer(layer))

NETWORK,LEVELS = getNetworkConf(cfg.model,['input'])

@app.route("/")
def index():
    return "Hello"

@app.route("/inputs",methods=['GET','POST'])
def get_inputs():
    return {
        "inputs":list(cfg.input_config['examples'].keys())
    }
    
@app.route("/predict/<string:example>")
def predict(example:str):
    network,levels = NETWORK.copy(),LEVELS.copy()
    inp = cfg.input_config['examples'][example]
    setOutput(cfg.model,network,levels,input_values=inp)
    
    return  {
        "network":network,
        "levels":levels,
        "output_class":{
            "out":inp['output_class']
        },
        "input_config":cfg.input_config['layer_config']
    }

if __name__ == "__main__":
    app.run(host="localhost",port="8081")