import { Dense } from './dense.js';
import { Conv2D } from './conv2d.js';
import { Concatenate } from './concatenate';
import { InputLayer } from './inputlayer';

const layers =  {
    "Dense": Dense,
    "Concatenate": Dense,
    "Conv2D": Conv2D,
    "InputLayer": InputLayer,
    "Flatten": Dense,
    "MaxPooling2D": Conv2D
  }

export {layers}