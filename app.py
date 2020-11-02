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


NETWORK,LEVELS = cfg.get_conf(cfg.model,cfg.input_config)

@app.route("/")
def index():
    return "Hello"

@app.route("/inputs",methods=['GET','POST'])
def get_inputs():
    return {
        "inputs":[i['name'] for i in cfg.input_config['examples']]
    }
    
@app.route("/predict/<int:example>")
def predict(example:int):
    network,levels = NETWORK.copy(),LEVELS.copy()
    input_value = cfg.input_config['examples'][example]
    cfg.set_output(
        cfg.model,
        network,
        levels,
        input_values=input_value,
        input_config=cfg.input_config['input_layers_config']
    )
    
    return  {
        "network":network,
        "levels":levels,
        "output_class":{
            "out":input_value['output']
        },
        "input_config":cfg.input_config['input_layers_config']
    }

if __name__ == "__main__":
    app.run(host="localhost",port="8081")