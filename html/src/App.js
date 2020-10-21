import React from 'react';
import "./App.css"

import {output as data} from './sample';

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
 
  React.useEffect(()=>{
    let canvasMargin = 30;
    let canvasPadding = 20;

    let canvas = document.getElementById("graph");
 
    let ctx = canvas.getContext("2d");
    
    let maxNeurons = Math.max(...data.levels.map((level,_)=>{
          return level.reduce((a,b) => a + data.network[b].outputs.length, 0);
    }))
    let neuronRadius = 3;
    
    let levelHeight,levelWidth,levelX,levelY,nNeruons,levelPadding= 8 ,levelMargin= 48;
    let layerX,layerY,layerWidth;
    let neuronX,neuronY,arc = Math.PI * 2, neuronMargin = 8;

    levelHeight =   2 * ( neuronRadius + levelPadding);

    let canvasWidth = Math.max(
      ( window.innerWidth - 5 ),
      (maxNeurons * 2 * neuronRadius ) + ((maxNeurons + 1)*neuronMargin) + ( 3 * canvasPadding ) 
    );
    let canvasHeight = Math.max(
      ( window.innerHeight - 5 ), 
      ( data.levels.length * (levelHeight + levelMargin) )
    );

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.overflow = "hidden";    

    data.levels.map((level,i)=>{
      nNeruons = level.reduce((a,b) => a + data.network[b].outputs.length, 0);  
      levelWidth = (nNeruons * 2 * neuronRadius ) + ((nNeruons + 1)*neuronMargin) + levelPadding;
      layerWidth = Math.floor(levelWidth/level.length)

      level.map((layer,j)=>{
        layerX = Math.floor( (canvasWidth/2) - (levelWidth/2) + (j*layerWidth) - (levelHeight*(level.length-1)) + (levelHeight*2*(j)));
        layerY = canvasPadding + ( i * ( levelHeight +  ( 2 * levelMargin ) ) );
        draw.Rect({
          x:layerX,
          y:layerY,
          h:levelHeight,
          w:layerWidth
        },ctx)

        data.network[layer].outputs.map((neuron,k)=>{
          neuronY = layerY + neuronRadius + levelPadding;
          neuronX = layerX + neuronRadius + (k*((neuronRadius*2)+neuronMargin)) + levelPadding

          draw.Circle({
            x:neuronX,
            y:neuronY,
            r:neuronRadius,
            c:`rgba(0,0,0,${neuron+0.1})`
          },ctx)
        })

      })
    })
  },[draw,])

  return (
      <canvas id="graph" style={{background:"#e0e0e0",overflow:"scroll",}}>
      </canvas>      
  );
}

export default App;
