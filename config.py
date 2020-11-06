"""
Config file for nnviz
"""

import numpy as np
import tensorflow as tf

from tensorflow.keras.models import model_from_json
from os import path as pathlib

from utils import *

model_path = pathlib.abspath("./examples/notebooks/saved_model/mnist_dense_diff.json")
weights_path = pathlib.abspath("./examples/notebooks/saved_model/mnist_dense_diff")

"""
Data Prep
"""

(x,y),(_,_) = tf.keras.datasets.mnist.load_data()
x = x.astype(np.float32).reshape(-1,784) 

input_config = {
    "examples":[
        {
            "name":f"ex_{i}_class_{str(y[i])}",
            "input":{ 
                "value":x[i:i+1],
            },
            "output":str(y[i])
        }
        for i in np.random.randint(0,len(x),20)
    ],
    "input_layers_config":{
        "input":{
            "type":"image",
            "shape":(28,28),
            "transformer":"prepare_input_image",
            "resize":(128,128)
        }
    },
    "input_nodes":['input']
}

model = model_from_json(open(model_path,"r").read())
model.load_weights(weights_path)
