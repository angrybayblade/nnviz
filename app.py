from flask import Flask,request
from flask_cors import CORS
from json import loads,dumps

import io
import numpy as np
import cv2
import base64
import matplotlib.pyplot as plt
import config as cfg


app = Flask(__name__)
CORS(app=app)

"""
Input Transfermers
"""

def imageToBase64(image:np.ndarray)->str:
    cv2.imwrite("./temp.png",image)
    stream = open("./temp.png","rb")
    return base64.b64encode(stream.read())

def transfomImage(x:np.ndarray,shape:tuple,norm:bool=True):
    image = (x.reshape(shape)*(255 if norm else 1)).astype(np.uint8)
    base64string = imageToBase64(image)
    return base64string

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
                    network[layer]['outputs'] = list((out.numpy().astype(float) / out.numpy().max())[0])
                else:
                    inputs = [tempOut[i] for i in layer_['inbound']]
                    out = model.get_layer(layer)(inputs)
                    tempOut[layer] = out
                    network[layer]['outputs'] = list((out.numpy().astype(float) / out.numpy().max())[0])
            else:
                inputs = input_values[layer]
                out = model.get_layer(layer)(inputs)
                tempOut[layer] = out
                network[layer]['outputs'] = list((out.numpy().astype(float) / out.numpy().max())[0])

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
        "levels":levels[1:],
        "output_class":{
            "out":inp['output_class']
        },
        "input":{
            "type":"image",
            "value":str(transfomImage(inp['input'],(28,28)),encoding="utf-8")
        }
    }

if __name__ == "__main__":
    app.run(host="localhost",port="8081")