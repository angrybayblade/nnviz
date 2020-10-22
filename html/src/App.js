import React from 'react';
import "./App.css"

import {output} from './sample';

var a;

function App() {

  let draw = {
    Circle:function(data={x:Number,y:Number,r:Number,c:Number},ctx){
      ctx.beginPath();
      ctx.arc(data.x,data.y,data.r,0,Math.PI*2,false);
      ctx.fillStyle = data.c;
      ctx.fill();
    },
    Rect:function(data={x:Number,y:Number,w:Number,h:Number},ctx){
      ctx.beginPath();
      ctx.rect(data.x,data.y,data.w,data.h);
      ctx.stroke();
    }
  }

  let [ctx,ctxState] = React.useState({
    ctx:undefined,
    canvas:undefined
  })

  let [data,dataState] = React.useState({})

  let [config,configState] = React.useState({
    canvas:{
      margin:30,
      padding:20,
      width:0,
      height:0
    },
    neuron:{
      radius:3,
      max:0,
      x:0,
      y:0,
      margin:8
    },
    level:{
      height:0,
      width:0,
      x:0,
      y:0,
      padding:8,
      margin:48
    },
    layer:{
      x:0,
      y:0,
      width:0
    }
  })
  
  function setupCanvas(data){
    let canvas = document.getElementById("graph");
    let ctx = canvas.getContext("2d");

    config.neuron.max = Math.max(...data.levels.map((level,_)=>{
          return level.reduce((a,b) => a + data.network[b].outputs.length, 0);
    }))

    config.level.height =   2 * ( config.neuron.radius + config.level.padding);

    config.canvas.width = Math.max(
      ( window.innerWidth - 5 ),
      (config.neuron.max * 2 * config.neuron.radius ) + 
      ((config.neuron.max + 1)*config.neuron.margin) + 
      ( 3 * config.canvas.padding ) 
    );

    config.canvas.height = Math.max(
      ( window.innerHeight - 5 ), 
      ( data.levels.length * ( config.level.height + config.level.margin) )
    );

    canvas.width = config.canvas.width;
    canvas.height = config.canvas.height;
    canvas.style.overflow = "hidden";  

    ctxState({
      ctx:ctx,
      canvas:canvas
    })
    configState({
      ...config
    })
  }

  function drawNetwork(data=output){
    let ctx = document.getElementById("graph").getContext("2d");;
    data.levels.map((level,i)=>{
      let n = level.reduce((a,b) => a + data.network[b].outputs.length, 0);  
      let levelWidth = (n * 2 * config.neuron.radius ) + ((n + 1)*config.neuron.margin) + config.level.padding;
      let layerWidth = Math.floor(levelWidth/level.length)

      level.map((layer,j)=>{
        let layerX = Math.floor(
          (config.canvas.width/2) - 
          (levelWidth/2) + 
          (j*layerWidth) - 
          (config.level.height*(level.length-1)) + 
          (config.level.height*2*(j))
        );

        let layerY = config.canvas.padding + ( i * ( config.level.height +  ( 2 * config.level.margin )))

        draw.Rect({
          x:layerX,
          y:layerY,
          h:config.level.height,
          w:layerWidth
        },ctx)

        data.network[layer].outputs.map((neuron,k)=>{
          let neuronY = layerY + config.neuron.radius + config.level.padding;
          let neuronX = layerX + config.neuron.radius + (k*((config.neuron.radius*2)+config.neuron.margin)) + config.level.padding

          draw.Circle({
            x:neuronX,
            y:neuronY,
            r:config.neuron.radius,
            c:`rgba(0,0,0,${neuron+0.1})`
          },ctx)
        })

      })
    })
  }
  
  React.useEffect(()=>{
    setupCanvas(output)
    drawNetwork(output)
  },[])

  return (
      <canvas id="graph" style={{background:"#e0e0e0",overflow:"scroll",}}>
      </canvas>      
  );
}

export default App;
