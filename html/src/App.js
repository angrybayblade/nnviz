import React, { createContext } from 'react';
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
  };
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

  

  class Concatenate{
    constructor(data={class_name:"Dense",inbound:[],outbound:[],outputs:[],level:0},ctx=CanvasRenderingContext2D) {
      this.data = data;    
      this.ctx = ctx;  
    }
  }

  class Conv2D{
    constructor(data={class_name:"Dense",inbound:[],outbound:[],outputs:[],level:0},ctx=CanvasRenderingContext2D) {
      this.data = data;    
      this.ctx = ctx;  
    }
  }

  class MaxPoolling2D{
    constructor(data={class_name:"Dense",inbound:[],outbound:[],outputs:[],level:0},ctx=CanvasRenderingContext2D) {
      this.data = data;    
      this.ctx = ctx;  
    }
  }

  class InputLayer{
    constructor(data={class_name:"Dense",inbound:[],outbound:[],outputs:[],level:0},ctx=CanvasRenderingContext2D) {
      this.data = data;    
      this.ctx = ctx;  
    }
  }

  class Dense{
    constructor(data={class_name:"Dense",inbound:[],outbound:[],outputs:[],level:0},ctx=CanvasRenderingContext2D) {
      this.data = data;    
      this.ctx = ctx;  
      this.config = {
        radius:3,
        margin:6,
        height:0,
        width:0
      }
    }

    calculateWidth(){
      this.config.width = ( this.data.outputs.length * 2 * this.config.radius ) + 
        ( ( this.data.outputs.length + 2 ) * ( this.config.margin) );
      return this.config.width
    }

    calculateHeight(){
      this.config.height = 2 * (this.config.radius + 2 * this.config.margin);
      return this.config.height
    }
    
    renderNeuron(config,neuron,k,layer){
      config.neuron.y = (
        config.layer.y + 
        this.config.radius + 
        this.config.margin * 2
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
      },this.ctx)
    }

    renderEdges(config,data){
      config.level.last.map((layer,_)=>{
        data.network[layer].outputs.map((neuron,l)=>{
          config.edges.to = config.edges.map[`${layer}_${l}`];
          if (neuron > 0.8){
            draw.Line({
              x0:config.neuron.x,
              y0:config.neuron.y - 15,
              x1:config.edges.to.x,
              y1:config.edges.to.y + 15,
              t:0.1,
              c:`rgba(0,0,0,${neuron})`
            },this.ctx)  
          }
        })
      })
    }

    render(config,data,layer){
      draw.Rect({
        x:config.layer.x,
        y:config.layer.y,
        h:config.level.height,
        w:this.config.width
      },this.ctx)

      // Rendering Neurons
      this.data.outputs.map((neuron,k)=>{
        this.renderNeuron(config,neuron,k,layer);
        this.renderEdges(config,data);
      })

    }
  }

  let layers = {
    "Dense":Dense,
    "Concatenate":Dense,
    "Conv2D":Conv2D,
    "MaxPoolling2D":MaxPoolling2D,
    "InputLayer":InputLayer
  }

  class Network{
    constructor(data={network:{},levels:[],output_class:[],input:[]},ctx=CanvasRenderingContext2D,canvas=undefined){
      this.data = data;    
      this.ctx = ctx;
      this.canvas = canvas;
      this.config = {
        network:{
          height:0
        },
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
          margin:32,
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
      }

      this.network = {};
      
      Object.keys(this.data.network).map((layer,i)=>{
        let _layer = this.data.network[layer];
        this.network[layer] = new layers[_layer.class_name](data=_layer,ctx=this.ctx);
      })
    }

    setupCanvas(){
      this.config.neuron.max = Math.max(...this.data.levels.map((level,_)=>{
            return level.reduce((a,b) => a + this.data.network[b].outputs.length, 0);
      }))
  
      this.config.level.height =   2 * ( this.config.neuron.radius + this.config.level.padding);
  
      this.config.canvas.width = Math.max(
        ( window.innerWidth - 5 ),
        (this.config.neuron.max * 2 * this.config.neuron.radius ) + 
        ((this.config.neuron.max + 1)*this.config.neuron.margin) + 
        ( 3 * this.config.canvas.padding ) 
      );
  
      this.config.canvas.height = Math.max(
        ( window.innerHeight - 95 ), 
        ( ( ( this.data.levels.length ) * ( this.config.level.height + this.config.level.margin )) + ( this.config.level.margin * 9 ))
      );
  
      this.canvas.width = this.config.canvas.width;
      this.canvas.height = this.config.canvas.height + (this.config.level.margin * 2) ;
      this.canvas.style.overflow = "hidden";  
  
      this.ctx.beginPath();
      this.ctx.rect(0,0,this.config.canvas.width,this.config.canvas.height);
      this.ctx.fillStyle = "whitesmoke";
      this.ctx.closePath()
      this.ctx.fill()

    }

    setInput(){
      let imageX,imageY;
      let image = new Image();
      image.style.height = "100px";
      image.style.width = "100px";
      image.src = 'data:image/png;base64,' + this.data.input.value;

      imageX = Math.floor( ( this.config.canvas.width / 2 ) - (128/2));
      imageY = 0;

      setTimeout(function(){
        document.getElementById("graph").getContext("2d").drawImage(
          image, imageX, imageY
        );
      })
    }

    setOutput(){
      this.config.font.y = this.config.network.height + ( this.config.level.margin * 2 ) + 128 + 48 ;

      Object.keys(this.data.output_class).map((layer,i)=>{
        let text = this.data.output_class[layer] + ' ';
        let textMetrics = this.ctx.measureText(text);
        let fontSize = 30;
        let fontWidth = Math.floor(textMetrics.width * ( fontSize / 9));

        this.config.font.x = Math.floor( 
          (this.config.canvas.width/2) + 
          (this.config.canvas.padding / 2) -
          (fontWidth / 2) 
        );

        this.ctx.beginPath();
        this.ctx.font = `${fontSize}px Arial`;
        this.ctx.fillStyle = "#333";
        this.ctx.fillText(
          text,
          this.config.font.x,
          this.config.font.y
        );

        draw.Rect({
          x:this.config.font.x - 6,
          y:this.config.font.y - fontSize,
          w: fontWidth,
          h: fontSize + 6
        },this.ctx)

        this.data.network[layer].outputs.map((neuron,l)=>{
          this.config.edges.to = this.config.edges.map[`${layer}_${l}`];
          if (neuron > 0.9){
            draw.Line({
              x0:Math.floor(this.config.font.x + (fontWidth / 3)) ,
              y0:Math.floor(this.config.font.y - fontSize ),
              x1:this.config.edges.to.x,
              y1:this.config.edges.to.y,
              t:1,
              c:`rgba(0,0,0,${neuron})`
            },this.ctx)  
          }
        })
      })

    } // End setOutput

    render(){
      this.setInput();
      this.data.levels.map((level,i)=>{
        this.config.level.width = level.map((layer,_)=>{
          return this.network[layer].calculateWidth();
        }).reduce(function(a,b){
          return a+b;
        },0)
        
        this.config.level.height = Math.max(...level.map((layer,_)=>{
          return this.network[layer].calculateHeight();
        }))

        this.config.network.height += ( 
          this.config.level.height + 
          ( this.config.level.margin * 2)
        )

        // Iterating layers in current level
        level.map((layer,j)=>{
          this.config.layer.x = Math.floor(
            (this.config.canvas.width/2) - 
            (this.config.level.width/2) + 
            (j* this.network[layer].config.width) - 
            (this.config.level.height*(level.length-1)) + 
            (this.config.level.height*2*(j))
          ); 
          
          this.config.layer.y = 128 + this.config.level.margin + Math.floor(
            this.config.canvas.padding + 
            ( i * ( this.config.level.height +  ( 2 * this.config.level.margin ))) + 
            50
          );

          if (i > 0){
            this.config.level.last = this.data.levels[i-1];
          }else{
            this.config.level.last = ['input'];
            this.data.network['input'].outputs = [1,]
            this.config.edges.map['input_0'] = {
              y:114,
              x:Math.floor( ( this.config.canvas.width / 2 ))
            }
          }
          this.network[layer].render(this.config,this.data,layer)
        })
      })
      this.setOutput();
    } // End Render

  }

  
  async function renderGraph(example){
    await axios({
      method:"GET",
      url:`http://localhost:8081/predict/${example}`,
      data:{
        example:example
      }
    }).then(response=>{
      let canvas = document.getElementById("graph");
      let ctx = canvas.getContext('2d');

      console.log(response.data);
      

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
