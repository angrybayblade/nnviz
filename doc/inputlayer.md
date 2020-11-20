### ```function InputLayer```
`tensorflow.keras.layers.InputLayer` / `tensorflow.keras.layers.Input`

`args`:
```js
{
    data:{
        class_name: "InputLayer", // Name of the layer class  
        inbound: [], // List of inbound nodes
        outbound: [], // List of outbound nodes
        outputs: [], // Output value depending on
        level: 0 // Level in hierarchical representation
    }, 
    ctx :CanvasRenderingContext2D, // Canvas Rendering Context 
    name:"InputLayer", // Name of the layer 
    network:{} // Network config
}
```
`types`

1. Image 
2. Row ( with columns )
3. Row ( without columns )
4. Time Series ( With columns )
5. Time Series ( Without columns )
6. Word Tokens
   

### class Row

`config`

```js
{
    height:0,
    width:0,
    cell:{
        height:0,
        width:0
    },
    xmin:0,
    ymin:0,
    xmax:0,
    ymax:0
}
```