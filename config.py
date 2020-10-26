"""
Config file for nnviz
"""

import numpy as np
import tensorflow as tf

from tensorflow.keras.models import model_from_json

from os import path as pathlib

model_path = pathlib.abspath("./examples/notebooks/saved_model/mnist_dense.json")
weights_path = pathlib.abspath("./examples/notebooks/saved_model/mnist_dense")

"""
Data Prep
"""

(x,y),(_,_) = tf.keras.datasets.mnist.load_data()
x = x.reshape(-1,28*28).astype(np.float32) / 255

input_config = {
    "types":{
        "input":{
            "type":"image",
            "render":True, 
            "shape":(28,28) # Use (Height, Width, Channel) for RGB image and (Height, Width) for BW images
        }
    },
    "examples":{
        f"{i}_class_{str(y[i])}":{
            "output_class": str(y[i]),
            "input":x[i:i+1],
            "transform":"image"
        }
        for i in np.random.randint(0,len(x),10)
    }
}

output_config = {
    "type":"single class",
}

model = model_from_json(open(model_path,"r").read())
model.load_weights(weights_path)
