### Network Class

```javascript
class Network{
    constructor(args={ data:{network:{},levels:[]} }){
        ...
    }
    .
    .
    .
}
```

`Network class contains methods for configuring and rendering neural networks`

#### Arguments
```js
{
    data:{
        network:{
            layer_name:{
                {
                    class_name: "Dense", 
                    inbound: [], 
                    outbound: [], 
                    outputs: [], 
                    level: 0 
                }
            }
        }, // Object containing layer configuration
        levels:[

        ], // Hierarchical representation of neural network
        input:{

        }, // Object containing input data for input layers
        output:{

        }, // Object containing output class  / values / information
    } // Neural network configuration
}
```

#### Methods

`setupCanvas()` : Calculates various geometrical attributes and sets up a canvas for network rendering. 

`render()` : Renders neural network for given configuration.

`addHandler()` : Adds a event handler for various mouse events.

#### Network Config

```js
{
    network: { height: 0, width:0 },
    canvas: { margin: 30, padding: 192, width: 0, height: 0 },
    level: { height: 0, width: 0, x: 0, y: 0, margin: 96, last: [], depth: 0 },
    neuron: { max: 0, x: 0, y: 0, },
    layer: { x: 0, y: 0, width: 0, padding: 8, marginHr: 48 },
    edges: { to: {}, map: {} },
    font: { x: 0, y: 0 }
}
```
