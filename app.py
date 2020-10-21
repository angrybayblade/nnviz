from flask import Flask,request
from json import loads,dumps

import numpy as np


app = Flask(__name__)
inputValues = {
    'input':X[0:1]
}

def setLevels(network,inputNodes,currentLevel=0):
    for node in inputNodes:
        network[node]['level'] = currentLevel
        setLevels(network,network[node]['outbound'],currentLevel+1)

def getNetworkConf(model,inputNodes):
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

def setOutput(model,network:dict,levels:list):
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
                inputs = inputValues[layer]
                out = model.get_layer(layer)(inputs)
                tempOut[layer] = out
                network[layer]['outputs'] = list((out.numpy().astype(float) / out.numpy().max())[0])

@app.route("/")
def index():
    return "Hello"


@app.route("/predict")
def predict():
    return "predicted"

if __name__ == "__main__":
    app.run(host="localhost",port="8081")