import { Dense } from './dense.js';
import { Conv2D } from './conv2d.js';
import { InputLayer } from './inputlayer';

const layers =  {
  "Dense": Dense,
  "Conv2D": Conv2D,
  "InputLayer": InputLayer,
  "Flatten": Dense,
  "MaxPooling2D": Conv2D,
}

function extension(args={data:{ class_name: "Dense", inbound: [], outbound: [], outputs: [], level: 0 }, ctx :CanvasRenderingContext2D, name:"Dense", network:{}}) {
    let parent = args.data.inbound[0];
    let obj = new layers[args.network[parent].class_name](args={
      data:{
        ...args.data,
        class_name:args.network[parent].class_name
      },
      ctx:args.ctx,
      name:args.name,
      network:args.network,
      parent:parent
    });
    return obj;
} // End extension

// Appending extension Layers

 
layers.Concatenate = extension
layers.Activation = extension
layers.Add = extension
layers.BatchNormalization = extension
layers.ZeroPadding2D = Conv2D

export {layers}