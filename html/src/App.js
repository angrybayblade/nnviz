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
      margin:6,
    },
    level:{
      height:0,
      width:0,
      x:0,
      y:0,
      padding:8,
      margin:48,
      last:[]
    },
    layer:{
      x:0,
      y:0,
      width:0
    },
    edges:{
      to:{},
      map:{}
    },
    font:{
      x:0,
      y:0
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

  function setupInput(data){
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

  }

  function renderEdges(ctx,config,data){
    config.level.last.map((layer,_)=>{
      data.network[layer].outputs.map((neuron,l)=>{
        config.edges.to = config.edges.map[`${layer}_${l}`];
        if (neuron > 0.8){
          draw.Line({
            x0:config.neuron.x,
            y0:config.neuron.y - 11,
            x1:config.edges.to.x,
            y1:config.edges.to.y + 11,
            t:0.1,
            c:`rgba(0,0,0,${neuron})`
          },ctx)  
        }
      })
    })
  }

  function renderNeuron(ctx,config,neuron,k,layer){
    config.neuron.y = (
      config.layer.y + 
      config.neuron.radius + 
      config.level.padding
    );
    config.neuron.x = (
      config.layer.x + 
      config.neuron.radius + 
      (k*((config.neuron.radius*2)+config.neuron.margin)) + 
      config.level.padding
    )
    
    config.edges.map[`${layer}_${k}`] = {
      x:config.neuron.x,
      y:config.neuron.y
    };

    draw.Circle({
      x:config.neuron.x,
      y:config.neuron.y,
      r:config.neuron.radius,
      c:`rgba(0,0,0,${neuron+0.1})`
    },ctx)
  }

  function setOutput(ctx,config,data){
    config.font.y = (config.level.height + config.level.margin)*(data.levels.length+3)+50;
    Object.keys(data.output_class).map((layer,i)=>{
      let text = data.output_class[layer] + ' ';
      let textMetrics = ctx.measureText(text);
      let fontSize = 30;
      let fontWidth = Math.floor(textMetrics.width * ( fontSize / 9));

      config.font.x = Math.floor( 
        (config.canvas.width/2) + 
        (config.canvas.padding / 2) -
        (fontWidth / 2) 
      );

      ctx.beginPath();
      ctx.font = `${fontSize}px Arial`;
      ctx.fillStyle = "#333";
      ctx.fillText(
        text,
        config.font.x,
        config.font.y
      );

      draw.Rect({
        x:config.font.x - 6,
        y:config.font.y - fontSize,
        w: fontWidth,
        h: fontSize + 6
      },ctx)

      data.network[layer].outputs.map((neuron,l)=>{
        config.edges.to = config.edges.map[`${layer}_${l}`];
        if (neuron > 0.9){
          draw.Line({
            x0:Math.floor(config.font.x + (fontWidth / 3)) ,
            y0:Math.floor(config.font.y - fontSize ),
            x1:config.edges.to.x,
            y1:config.edges.to.y,
            t:1,
            c:`rgba(0,0,0,${neuron})`
          },ctx)  
        }
      })
    })
  }

  function drawNetwork(data){
    let ctx = document.getElementById("graph").getContext("2d");
    config.level.last = []

    // Iterating levels to draw hierarchy
    data.levels.map((level,i)=>{
      let n = level.reduce((a,b) => a + data.network[b].outputs.length, 0); // Number of neurons in current level
      config.level.width = Math.floor(
        (n * 2 * config.neuron.radius ) + 
        ((n + 1)*config.neuron.margin) + 
        config.level.padding
      ); // Current level width
      config.layer.width = Math.floor(config.level.width/level.length) // Width of each layer in current level , change to dynamic adaption for variables size layers
      
      // Iterating layers in current level
      level.map((layer,j)=>{
        config.layer.x = Math.floor(
          (config.canvas.width/2) - 
          (config.level.width/2) + 
          (j*config.layer.width) - 
          (config.level.height*(level.length-1)) + 
          (config.level.height*2*(j))
        ); 
        config.layer.y = Math.floor(
          config.canvas.padding + 
          ( i * ( config.level.height +  ( 2 * config.level.margin ))) + 
          50
        );

        draw.Rect({
          x:config.layer.x,
          y:config.layer.y,
          h:config.level.height,
          w:config.layer.width
        },ctx)

        if (i > 0){
          config.level.last = data.levels[i-1];
        }
        // Rendering Neurons
        data.network[layer].outputs.map((neuron,k)=>{
          renderNeuron(ctx,config,neuron,k,layer);
          // Rendering edges
          renderEdges(ctx,config,data);

        })
      })
    })
    setOutput(ctx,config,data)
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
      console.log(response.data.network)
      setupCanvas(response.data);
      setupInput(response.data);
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
