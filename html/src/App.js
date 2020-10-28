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
    constructor(data={class_name:"Dense",inbound:[],outbound:[],outputs:[],level:0},ctx=CanvasRenderingContext2D,name='Conv2D') {
      this.data = data;    
      this.ctx = ctx;
      this.name = name;
      this.config = {
        radius:3,
        margin:6,
        height:0,
        width:0,
      }  
    }

    popUp(i,x,y){
      window.popped = false;
      let canv = document.createElement("img");
      let pop = document.getElementById("pop");
      canv.className = "popup-img";
      canv.src = this.data.outputs[i];
      pop.innerHTML = '';

      pop.style.top = `${y}px`
      pop.style.left = `${x}px`
      
      pop.appendChild(canv)
      setTimeout(function(){
        window.popped = true;
      },100)
    } // End popUp

    calculateWidth(){
      this.config.width = ( this.data.outputs.length * 2 * this.config.radius ) + 
        ( ( this.data.outputs.length + 1 ) * ( this.config.margin) );
      return this.config.width
    }

    calculateHeight(){
      this.config.height = 2 * (this.config.radius + 2 * this.config.margin);
      return this.config.height
    }

    renderMap(config,neuron,k){
      config.neuron.y = (
        config.layer.y + 
        this.config.radius + 
        this.config.margin * 2
      );

      config.neuron.x = (
        config.layer.x + 
        this.config.radius + 
        (k*((this.config.radius*2)+this.config.margin)) + 
        this.config.margin
      )
      
      config.edges.map[`${this.name}_${k}`] = {
        x:config.neuron.x,
        y:config.neuron.y
      };
  
      draw.Circle({
        x:config.neuron.x,
        y:config.neuron.y,
        r:this.config.radius,
        c:`rgba(0,0,0,0.5)`
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
    
    render(config,data,network){
      draw.Rect({
        x:config.layer.x,
        y:config.layer.y,
        h:config.level.height,
        w:this.config.width
      },this.ctx)

      // Rendering Neurons
      this.data.outputs.map((neuron,k)=>{
        this.renderMap(config,neuron,k);
        // this.renderEdges(config,data);
      })
    }

  }



  class InputLayer{
    constructor(data={class_name:"Dense",inbound:[],outbound:[],outputs:[],level:0},ctx=CanvasRenderingContext2D,name="InputLayer") {
      this.data = data;    
      this.ctx = ctx;  
      this.name = name;
      this.config = {
        margin:6,
        height:64,
        width:128
      }
    }

    calculateWidth(){
      return this.config.width
    }

    calculateHeight(){
      return this.config.height
    }

    prepFunction_image(config,data){

      let Ix = Math.floor(config.canvas.width/2) ;
      let Iy = 0;

      this.ctx.beginPath()
      this.ctx.rect(Ix - 72,Iy,144,144)
      this.ctx.strokeStyle = "#333"
      this.ctx.lineWidth = 2;
      this.ctx.closePath();
      this.ctx.stroke()

      let image = new Image();
      image.onload = function(){
        document.getElementById("graph").getContext("2d").drawImage(image, Ix - 64,Iy + 8)
      }
      image.src = this.data.outputs;

      //  Setting tail for edge from next layer
      data.network[this.name].outputs = [1,]
      config.edges.map[`${this.name}_0`] = {
        x:Ix,
        y:Iy + 132
      }
    }

    render(config,data){
      this['prepFunction_'+data.input_config[this.name].type](config,data);
    }

  }

  class Dense{
    constructor(data={class_name:"Dense",inbound:[],outbound:[],outputs:[],level:0},ctx=CanvasRenderingContext2D,name="Dense") {
      this.data = data;    
      this.ctx = ctx;  
      this.name = name;
      this.config = {
        radius:3,
        margin:6,
        height:0,
        width:0
      }
    } // End cunstructor

    calculateWidth(){
      this.config.width = ( this.data.outputs.length * 2 * this.config.radius ) + 
        ( ( this.data.outputs.length + 1) * ( this.config.margin) );
      return this.config .width
    } // End calculateWidth

    calculateHeight(){
      this.config.height = 2 * (this.config.radius + 2 * this.config.margin);
      return this.config.height
    } // End calculateHeight

    popUp(i,x,y){
      window.popped = false;
      let canv = document.createElement("div");
      let pop = document.getElementById("pop");
      canv.className = "popup";
      canv.innerText = String(this.data.outputs[i]).slice(0,8);
      pop.innerHTML = '';

      pop.style.top = `${y}px`
      pop.style.left = `${x}px`
      
      pop.appendChild(canv)
      setTimeout(function(){
        window.popped = true;
      },100)
    } // End popUp
    
    renderNeuron(config,neuron,k,layer){
      config.neuron.y = (
        config.layer.y + 
        this.config.radius + 
        this.config.margin * 2
      );

      config.neuron.x = (
        config.layer.x + 
        this.config.radius + 
        (k*((this.config.radius*2)+this.config.margin)) + 
        this.config.margin
      )
      
      config.edges.map[`${layer}_${k}`] = {
        x:config.neuron.x,
        y:config.neuron.y
      }; 
  
      draw.Circle({
        x:config.neuron.x,
        y:config.neuron.y,
        r:this.config.radius,
        c:`rgba(0,0,0,${neuron+0.1})`
      },this.ctx)
    } // End renderNeuron

    renderEdges(config,data,network){
      let p1 = Math.floor( this.config.margin * 2.5),p2;
      config.level.last.map((layer,_)=>{
        p2 = Math.floor(network[layer].config.margin * 2.5)
        data.network[layer].outputs.map((neuron,l)=>{
          config.edges.to = config.edges.map[`${layer}_${l}`];
          if (neuron > 0.8){
            draw.Line({
              x0:config.neuron.x,
              y0:config.neuron.y - p1,
              x1:config.edges.to.x,
              y1:config.edges.to.y + p2,
              t:0.1,
              c:`rgba(0,0,0,${neuron})`
            },this.ctx)  
          }
        })
      })
    }

    render(config,data,network){
      draw.Rect({
        x:config.layer.x,
        y:config.layer.y,
        h:config.level.height,
        w:this.config.width
      },this.ctx)

      // Rendering Neurons
      this.data.outputs.map((neuron,k)=>{
        this.renderNeuron(config,neuron,k,this.name);
        this.renderEdges(config,data,network);
      })
    } // End render
  }

  let layers = {
    "Dense":Dense,
    "Concatenate":Dense,
    "Conv2D":Conv2D,
    "InputLayer":InputLayer,
    "Flatten":Dense,
    "MaxPooling2D":Conv2D
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
          margin:96,
          last:[],
          depth:0
        },
        layer:{
          x:0,
          y:0,
          width:0,
          padding:8
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
        this.network[layer] = new layers[_layer.class_name](data=_layer,ctx=this.ctx,layer);
      },100)
    }

    setupCanvas(){
      this.config.neuron.max = Math.max(...this.data.levels.map((level,_)=>{
            return level.reduce((a,b) => a + this.data.network[b].outputs.length, 0);
      })) 
  
      this.config.level.height =   2 * ( this.config.neuron.radius + this.config.level.padding);
  
      this.config.canvas.width = Math.max(
        ( window.innerWidth - 5 ),
        Math.max(...this.data.levels.map((level)=>{
          return level.map((layer,_)=>{
              return this.network[layer].calculateWidth() + ( 2 * 48);
            }).reduce(function(a,b){
              return a+b;
            },0)
          })
        )
      ); // End Math.max
  
      this.config.canvas.height = this.data.levels.map((level)=>{
            return ( this.config.level.margin )+ Math.max(...level.map((layer,_)=>{
              return this.network[layer].calculateHeight();
            }))
          }).reduce(function(a,b){
          return a+b;
        }); // this.data.levels.map
  
      console.log(this.config.canvas.height)

      this.canvas.width = this.config.canvas.width;
      this.canvas.height = this.config.canvas.height + (this.config.level.margin * 2) ;
      this.canvas.style.overflow = "hidden";  
  
      this.ctx.beginPath();
      this.ctx.rect(0,0,this.config.canvas.width,this.config.canvas.height);
      this.ctx.fillStyle = "whitesmoke";
      this.ctx.closePath()
      this.ctx.fill()

    } // End setupCanvas

    setOutput(){
      this.config.font.y = this.config.network.height + this.config.level.margin + 16;

      Object.keys(this.data.output_class).map((layer,i)=>{
        let text = this.data.output_class[layer] + ' ';
        let textMetrics = this.ctx.measureText(text);
        let fontSize = 30;
        let fontWidth = Math.floor(textMetrics.width * ( fontSize / 9));

        this.config.font.x = Math.floor( 
          (this.config.canvas.width/2) + 
          (this.config.canvas.padding / 2) -
          (fontWidth / 2) 
        ); // End Math.floor

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
        }) // End this.data.network[layer].outputs.map
      }) // Object.keys(this.data.output_class).map
    } // End setOutput

    render(){
      this.data.levels.map((level,i)=>{
        this.config.level.width = level.map((layer,_)=>{
          return this.network[layer].calculateWidth();
        }).reduce(function(a,b){
          return a+b;
        },0) // End reduce -> level.map
        
        this.config.level.height = Math.max(...level.map((layer,_)=>{
          return this.network[layer].calculateHeight();
        }))

        // Iterating layers in current level
        level.map((layer,j)=>{
          this.config.layer.x = Math.floor(
            (this.config.canvas.width/2) - 
            (this.config.level.width/2) + 
            (j* this.network[layer].config.width) - 
            (this.config.level.height*(level.length-1)) + 
            (this.config.level.height*2*(j))
          ); // End level.map 
          
          this.config.layer.y = this.config.level.margin + this.config.network.height;

          if (i > 0){
            this.config.level.last = this.data.levels[i-1];
          } // End if
          this.network[layer].render(this.config,this.data,this.network)
        })
        this.config.network.height += ( 
          this.config.level.height + 
          this.config.level.margin 
        )
      }) // End this.data.levels.map
      this.setOutput();
    } // End Render

    addHandler(){
      let config = this.config;
      let data = this.data;
      let network = this.network;
      let x,y,_x,_y,i,j,k,xlim;
      let depth,bredth;
      let levelHeight = 0,levelWidth;
      let level;
      let diff;

      this.canvas.onclick = function (e){
        x = e.pageX;
        y = e.pageY-150;
        depth = 0;
        bredth = 0;

        if ( y < config.network.height){
          for(i=0;i < data.levels.length; i++){
            level = data.levels[i];
            levelHeight = Math.max(...level.map((layer,_)=>{
              return network[layer].calculateHeight();
            })) // End Math.max

            levelWidth = level.map((layer,_)=>{
              return network[layer].calculateWidth();
            }).reduce(function(a,b){
              return a+b;
            },0) // End level.map

            depth += levelHeight + config.level.margin;
            diff = y - depth;
            if ( diff < 0 && diff + levelHeight > -1){
              level.map((layer,j)=>{
                layer = network[layer];
                bredth = Math.floor(( config.canvas.width / 2 ) -  ( levelWidth / 2 )) + layer.config.margin;
                diff = x - bredth;
                if(diff > -1 && diff < levelWidth - config.layer.padding){
                  i = Math.floor(diff / ( ( 2 * layer.config.radius )+layer.config.margin))
                  xlim = Math.floor( i * ( ( 2 * layer.config.radius )+layer.config.margin)) + (2 * layer.config.radius)
                  if (diff < xlim){
                    layer.popUp(i,x,y+150);
                  } // End If
                }// End If
              }) // End level.map
              break
            }// End If
          } // End For
        } // End If
      } // End function (e)
    } // End addHandler
  } // End class Network

  
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

      let net = new Network(response.data,ctx,canvas)
      net.setupCanvas();
      net.render();
      net.addHandler();
    })
  }

  React.useEffect(()=>{
    getInputs();
    window.popped = false;
  },[])

  function clearPop(){
    if (window.popped){
      document.getElementById('pop').innerHTML = '';
      window.popped = false;
    }
  }
  return (
    <div className="root" id="root" onClick={clearPop}>
      <div id="pop" className="pop">

      </div>
      <div style={{height:"150px"}}></div>
      <select onChange={(e)=>renderGraph(e.target.value)}>
        <option> Select Example ...</option>
        {
          input.examples.map((example,i)=>{
            return (
              <option key={i} >
                {example}
              </option>
            )
          })
        }
      </select>
      <canvas id="graph" style={{background:"whitesmoke",overflow:"scroll",}} >
      </canvas>
      
    </div>      
  );
}

export default App;
