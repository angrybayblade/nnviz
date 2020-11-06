"""
Config file for nnviz
"""

import numpy as np
import tensorflow as tf

from nnviz.utils import *

model_path = 'Path to model.json'
weights_path = 'Path to saved weights'

"""
Data Prep
"""

input_config = {
    "input_nodes":['list','of','input','nodes'],
    "examples":[
        {
            # Look at input_examples for detailed explaination
        }
    ],
    "input_layers_config":{
        # Look at input_layers_config for detailed explaination
    },
}

model = tf.keras.models.model_from_json(open(model_path,"r").read())
model.load_weights(weights_path)
