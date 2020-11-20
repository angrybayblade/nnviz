### ```class InputLayer```
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

`methods` 

1. calculateWidth -> int : calculates, stores and returns width using config.  
2. calculateHeight -> int : calculates, stores and returns height using config.  
3. prepFunction_image -> : render function for type=image.
4. prepFunction_row -> : render function for type=row.
5. render -> undefined : renders layer on canvas.

`config`

```js
{
    
}
```

`examples`

1. Image 
2. Row ( with columns )
3. Row ( without columns )
4. Time Series ( With columns )
5. Time Series ( Without columns )
6. Word Tokens