"""
Config file for nnviz
"""

import numpy as np
import tensorflow as tf

from tensorflow.keras.models import model_from_json

from os import path as pathlib

model_path = pathlib.abspath("./examples/notebooks/saved_model/mnist_conv.json")
weights_path = pathlib.abspath("./examples/notebooks/saved_model/mnist_conv")

"""
Data Prep
"""

(x,y),(_,_) = tf.keras.datasets.mnist.load_data()
x = x.astype(np.float32).reshape(-1,28,28,1) / 255

input_config = {
    "examples":{
        f"{i}_class_{str(y[i])}":{
            "output_class": str(y[i]),
            "input":x[i:i+1],
            "transform":"image"
        }
        for i in np.random.randint(0,len(x),10)
    },
    "layers":{
        "input":{
            "type":"image",
            "shape":(28,28),
            "transformer":"prepareInputImage",
            "resize":(128,128)
        }
    }
}

output_config = {
    "type":"single class",
}

model = model_from_json(open(model_path,"r").read())
model.load_weights(weights_path)
