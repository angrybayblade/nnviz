import React from 'react';
import axios from 'axios';
import "./App.css"

function App() {

  let draw = {
    Circle:function(data={x:0,y:0,r:0,c:0},ctx){
      ctx.beginPath();
      ctx.arc(data.x,data.y,data.r,0,Math.PI*2,false);
      ctx.fillStyle = data.c;
      ctx.closePath();
      ctx.fill();
    },
    Rect:function(data={x:0,y:0,w:0,h:0},ctx){
      ctx.beginPath();
      ctx.rect(data.x,data.y,data.w,data.h);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#333";
      ctx.closePath();
      ctx.stroke();
    },
    Line:function(data={x0:0,x1:0,y0:0,y1:0,c:"rgba(255,255,255,0.1)",t:0.1},ctx){
      ctx.beginPath();
      ctx.moveTo(data.x0,data.y0);
      ctx.lineTo(data.x1,data.y1);
      ctx.lineWidth = data.t;
      ctx.strokeStyle = data.c;
      ctx.closePath();
      ctx.stroke();
    }
  }

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
      ( window.innerHeight - 95 ), 
      ( data.levels.length * ( config.level.height + config.level.margin) )
    );

    canvas.width = config.canvas.width;
    canvas.height = config.canvas.height;
    canvas.style.overflow = "hidden";  


    configState({
      ...config
    })
  }

  function drawNetwork(data){
    let ctx = document.getElementById("graph").getContext("2d");
    let neuronCords = Object();

    let lastLevel = [];
    let lineTo;

    let inputDiv = document.getElementById("input");
    inputDiv.style.height= "150px";
    inputDiv.style.width = `${config.canvas.width}px`
    inputDiv.style.display = "flex"
    inputDiv.style.justifyContent = "center"
    inputDiv.style.alignItems = "flex-end" 

    let input = document.getElementById("image");
    input.style.height = "100px";
    input.style.width = "100px";
    input.src = 'data:image/png;base64,' + data.input.value;

    // Iterating levels to draw hierarchy
    data.levels.map((level,i)=>{
      let n = level.reduce((a,b) => a + data.network[b].outputs.length, 0);  
      let levelWidth = (n * 2 * config.neuron.radius ) + ((n + 1)*config.neuron.margin) + config.level.padding;
      let layerWidth = Math.floor(levelWidth/level.length)
      // Iterating layers in current level
      level.map((layer,j)=>{
        let layerX = Math.floor(
          (config.canvas.width/2) - 
          (levelWidth/2) + 
          (j*layerWidth) - 
          (config.level.height*(level.length-1)) + 
          (config.level.height*2*(j))
        );

        let layerY = config.canvas.padding + ( i * ( config.level.height +  ( 2 * config.level.margin ))) + 100;
        draw.Rect({
          x:layerX,
          y:layerY,
          h:config.level.height,
          w:layerWidth
        },ctx)

        if (i > 0){
          lastLevel = data.levels[i-1];
        }

        // Iterating neurons in current layer 
        data.network[layer].outputs.map((neuron,k)=>{
          let neuronY = layerY + config.neuron.radius + config.level.padding;
          let neuronX = layerX + config.neuron.radius + (k*((config.neuron.radius*2)+config.neuron.margin)) + config.level.padding
          
          neuronCords[`${layer}_${k}`] = {
            x:neuronX,
            y:neuronY
          };
          draw.Circle({
            x:neuronX,
            y:neuronY,
            r:config.neuron.radius,
            c:`rgba(0,0,0,${neuron+0.1})`
          },ctx)
          
          lastLevel.map((layer,_)=>{
            data.network[layer].outputs.map((neuron,l)=>{
              lineTo = neuronCords[`${layer}_${l}`];
              if (neuron > 0.8){
                draw.Line({
                  x0:neuronX,
                  y0:neuronY- 10,
                  x1:lineTo.x,
                  y1:lineTo.y + 10,
                  t:0.1,
                  c:`rgba(0,0,0,${neuron})`
                },ctx)  
              }
            })
          })
        })
      })
    })

    let fontY = (config.level.height + config.level.margin)*(data.levels.length+4)+50;
    let nouts = Object.keys(data.output_class).length;

    Object.keys(data.output_class).map((layer,i)=>{
      let text = data.output_class[layer] + ' ';
      let textMetrics = ctx.measureText(text);
      let fontSize = 30;
      let fontWidth = Math.floor(textMetrics.width * ( fontSize / 9));

      let fontX = Math.floor( 
        (config.canvas.width/2) + 
        (config.canvas.padding / 2) -
        (fontWidth / 2) 
      );

      ctx.beginPath();
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = "#333";
      ctx.fillText(
        text,
        fontX,
        fontY
      );

      draw.Rect({
        x:fontX - 6,
        y:fontY - fontSize,
        w: fontWidth,
        h: fontSize + 6
      },ctx)


      data.network[layer].outputs.map((neuron,l)=>{
        lineTo = neuronCords[`${layer}_${l}`];
        if (neuron > 0.5){
          draw.Line({
            x0:Math.floor(fontX + (fontWidth / 3)) ,
            y0:Math.floor(fontY - fontSize ),
            x1:lineTo.x,
            y1:lineTo.y,
            t:1,
            c:`rgba(0,0,0,${neuron})`
          },ctx)  
        }
      })


    })

  }

  let [input,inputState] = React.useState({
    examples:[]
  })
  
  async function getInputs(){
    await axios({
      url:"http://localhost:8081/inputs",
      method:"GET"
    }).then(response=>{
      inputState({
        examples:response.data.inputs
      })
    })
  }

  async function renderGraph(example){
    await axios({
      method:"GET",
      url:`http://localhost:8081/predict/${example}`,
      data:{
        example:example
      }
    }).then(response=>{
      setupCanvas(response.data);
      drawNetwork(response.data);
    })
  }

  React.useEffect(()=>{
    getInputs();
  },[])
  
  return (
    <div>
      <div className="examples">
        {
          input.examples.map((example,i)=>{
            return (
              <div className="example" key={i} onClick={()=>renderGraph(example)}>
                {example}
              </div>
            )
          })
        }
      </div>
      <div id="input">
        <img id="image" style={{}}>
                  
        </img>
      </div>
      <canvas id="graph" style={{background:"whitesmoke",overflow:"scroll",}}>
      </canvas>
    </div>      
  );
}

export default App;
