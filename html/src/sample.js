let output={
    "network": {
        "dense1": {
            "inbound": [
                "input"
            ],
            "outbound": [
                "dense20",
                "dense21"
            ],
            "class_name": "Dense",
            "level": 1,
            "outputs": [
                0.38211452379037397,
                0.0,
                0.17988113710404055,
                0.0,
                0.6052413012111586,
                0.0,
                0.0,
                0.24789382643232738,
                0.0,
                0.0,
                0.31375381705988437,
                0.0,
                0.8854417959218741,
                0.0,
                0.326234781734805,
                0.39496518101373207,
                0.0,
                0.3216387492350986,
                0.0,
                0.2196380391682827,
                0.0,
                0.0,
                0.0,
                0.0,
                0.06601656220265266,
                0.14997237496733049,
                0.0,
                0.4154667729023201,
                0.0,
                0.6618831617900331,
                0.0,
                0.1598061007266387,
                0.2267362184089643,
                0.11862588039113409,
                0.0,
                0.27096341360741377,
                0.2483397151548703,
                0.0,
                0.008754075407637773,
                0.9509807748900055,
                0.9733337691879917,
                0.49939180245185494,
                0.2777151236706237,
                0.0,
                0.0,
                0.3778627459188404,
                0.0,
                0.0,
                0.0,
                0.707998230869077,
                0.0,
                0.2300734658112,
                0.0,
                0.0,
                0.0,
                0.0,
                0.8372141643984194,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.05313377441667987,
                0.05249994786990146,
                0.0,
                0.45898874193688477,
                0.5283648097220047,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                0.0,
                1.0,
                0.13333524999635482,
                0.0,
                0.09004322173102343,
                0.0,
                0.15018809754615395,
                0.0,
                0.0,
                0.7244912533533764,
                0.6015529203594766,
                0.46982200354233816,
                0.3661429198781551,
                0.0,
                0.0,
                0.0,
                0.720209294898478,
                0.3899536755482244,
                0.0,
                0.0,
                0.03570849526980109,
                0.22120666518977786,
                0.35567170768639095,
                0.31408029650032226,
                0.026221444464669355,
                0.0,
                0.09183374363248484,
                0.0,
                0.0,
                0.0,
                0.0,
                0.20980453878346067,
                0.0,
                0.1348237798852448,
                0.1221702077505933,
                0.2991458855712197,
                0.0,
                0.23723253535870917,
                0.057985690248755425,
                0.05369124800710161,
                0.0,
                0.0,
                0.2734124699585609,
                0.0,
                0.0,
                0.12722014446543758,
                0.0,
                0.6346215111833564,
                0.0,
                0.01274263180252711,
                0.6964905704098899,
                0.05162303534201186,
                0.1813689026794557,
                0.26049218181786826,
                0.03852649945369224,
                0.0
            ]
        },
        "dense20": {
            "inbound": [
                "dense1"
            ],
            "outbound": [
                "concatenate"
            ],
            "class_name": "Dense",
            "level": 2,
            "outputs": [
                0.0,
                0.5393617620312194,
                0.0,
                0.39324309461826057,
                0.6297232363997112,
                0.09371079303594687,
                0.3422101660935908,
                0.5027190349210742,
                0.0,
                0.0,
                0.0,
                0.5460741735390783,
                1.0,
                0.5820260566754625,
                0.2355956421627513,
                0.19168915437702883,
                0.0,
                0.7637228196683696,
                0.12807349909230178,
                0.5064401969435203,
                0.8679253738771874,
                0.0,
                0.41364555776200085,
                0.0,
                0.0,
                0.0,
                0.3100965452212557,
                0.6242852720057769,
                0.0,
                0.281943691075538,
                0.0,
                0.5042669619779048
            ]
        },
        "dense21": {
            "inbound": [
                "dense1"
            ],
            "outbound": [
                "concatenate"
            ],
            "class_name": "Dense",
            "level": 2,
            "outputs": [
                0.3918937608679059,
                0.041271556717881186,
                0.36919940053737405,
                0.10155098968098146,
                0.7713665996819885,
                0.10959342045510669,
                0.0,
                0.0,
                0.0,
                0.48229497460974957,
                0.0,
                0.0,
                0.0,
                0.23757498895169726,
                0.0,
                0.0,
                0.6232677095152666,
                0.0,
                0.0,
                0.13046768716209672,
                0.3366447507252754,
                1.0,
                0.01916388942428882,
                0.3255752213027953,
                0.0,
                0.6052578535953967,
                0.5492213913100369,
                0.0,
                0.10042435143736975,
                0.48224646791053344,
                0.0,
                0.3358960237655566
            ]
        },
        "concatenate": {
            "inbound": [
                "dense20",
                "dense21"
            ],
            "outbound": [
                "out"
            ],
            "class_name": "Concatenate",
            "level": 3,
            "outputs": [
                0.0,
                0.41009764358464024,
                0.0,
                0.2989979598322839,
                0.4788029733243621,
                0.07125194648163673,
                0.26019564716114746,
                0.382236758553054,
                0.0,
                0.0,
                0.0,
                0.4152013501058007,
                0.760338741923835,
                0.44253695969951184,
                0.17913249416476434,
                0.1457486904794739,
                0.0,
                0.580688047885172,
                0.09737924317362416,
                0.3850661022036954,
                0.6599172868575548,
                0.0,
                0.31451074299114273,
                0.0,
                0.0,
                0.0,
                0.23577841706845715,
                0.47466827831845154,
                0.0,
                0.214372711365737,
                0.0,
                0.38341370746403447,
                0.3918937608679059,
                0.041271556717881186,
                0.36919940053737405,
                0.10155098968098146,
                0.7713665996819885,
                0.10959342045510669,
                0.0,
                0.0,
                0.0,
                0.48229497460974957,
                0.0,
                0.0,
                0.0,
                0.23757498895169726,
                0.0,
                0.0,
                0.6232677095152666,
                0.0,
                0.0,
                0.13046768716209672,
                0.3366447507252754,
                1.0,
                0.01916388942428882,
                0.3255752213027953,
                0.0,
                0.6052578535953967,
                0.5492213913100369,
                0.0,
                0.10042435143736975,
                0.48224646791053344,
                0.0,
                0.3358960237655566
            ]
        },
        "out": {
            "inbound": [
                "concatenate"
            ],
            "outbound": [],
            "class_name": "Dense",
            "level": 4,
            "outputs": [
                2.8034217843205583e-06,
                3.908248407347839e-06,
                4.9279912526989946e-06,
                0.037037421158236494,
                1.918387903854072e-08,
                1.0,
                7.093444195700812e-08,
                0.0002028574654165208,
                4.328991873053909e-06,
                7.988626613624016e-06
            ]
        }
    },
    "levels": [
        [
            "dense1"
        ],
        [
            "dense20",
            "dense21"
        ],
        [
            "concatenate"
        ],
        [
            "out"
        ]
    ],
    "predicted_class":"5",
    "output_class":[
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9"
    ]
}
export {output}

// function setupCanvas(data){
//     let canvas = document.getElementById("graph");
//     let ctx = canvas.getContext("2d");

//     config.neuron.max = Math.max(...data.levels.map((level,_)=>{
//           return level.reduce((a,b) => a + data.network[b].outputs.length, 0);
//     }))

//     config.level.height =   2 * ( config.neuron.radius + config.level.padding);

//     config.canvas.width = Math.max(
//       ( window.innerWidth - 5 ),
//       (config.neuron.max * 2 * config.neuron.radius ) + 
//       ((config.neuron.max + 1)*config.neuron.margin) + 
//       ( 3 * config.canvas.padding ) 
//     );

//     config.canvas.height = Math.max(
//       ( window.innerHeight - 95 ), 
//       ( data.levels.length * ( config.level.height + config.level.margin) )
//     );

//     canvas.width = config.canvas.width;
//     canvas.height = config.canvas.height;
//     canvas.style.overflow = "hidden";  

//     ctx.beginPath();
//     ctx.rect(0,0,config.canvas.width,config.canvas.height);
//     ctx.fillStyle = "whitesmoke";
//     ctx.closePath()
//     ctx.fill()

//     configState({
//       ...config
//     })

//   }

//   function setupInput(data){
//     let inputDiv = document.getElementById("input");
//     inputDiv.style.height= "150px";
//     inputDiv.style.width = `${config.canvas.width}px`
//     inputDiv.style.display = "flex"
//     inputDiv.style.justifyContent = "center"
//     inputDiv.style.alignItems = "flex-end" 

//     let input = document.getElementById("image");
//     input.style.height = "100px";
//     input.style.width = "100px";
//     input.src = 'data:image/png;base64,' + data.input.value;

//   }

//   function renderEdges(ctx,config,data){
//     config.level.last.map((layer,_)=>{
//       data.network[layer].outputs.map((neuron,l)=>{
//         config.edges.to = config.edges.map[`${layer}_${l}`];
//         if (neuron > 0.8){
//           draw.Line({
//             x0:config.neuron.x,
//             y0:config.neuron.y - 11,
//             x1:config.edges.to.x,
//             y1:config.edges.to.y + 11,
//             t:0.1,
//             c:`rgba(0,0,0,${neuron})`
//           },ctx)  
//         }
//       })
//     })
//   }

//   function renderNeuron(ctx,config,neuron,k,layer){
//     config.neuron.y = (
//       config.layer.y + 
//       config.neuron.radius + 
//       config.level.padding
//     );
//     config.neuron.x = (
//       config.layer.x + 
//       config.neuron.radius + 
//       (k*((config.neuron.radius*2)+config.neuron.margin)) + 
//       config.level.padding
//     )
    
//     config.edges.map[`${layer}_${k}`] = {
//       x:config.neuron.x,
//       y:config.neuron.y
//     };

//     draw.Circle({
//       x:config.neuron.x,
//       y:config.neuron.y,
//       r:config.neuron.radius,
//       c:`rgba(0,0,0,${neuron+0.1})`
//     },ctx)
//   }

//   function setOutput(ctx,config,data){
//     config.font.y = (config.level.height + config.level.margin)*(data.levels.length+3)+50;
//     Object.keys(data.output_class).map((layer,i)=>{
//       let text = data.output_class[layer] + ' ';
//       let textMetrics = ctx.measureText(text);
//       let fontSize = 30;
//       let fontWidth = Math.floor(textMetrics.width * ( fontSize / 9));

//       config.font.x = Math.floor( 
//         (config.canvas.width/2) + 
//         (config.canvas.padding / 2) -
//         (fontWidth / 2) 
//       );

//       ctx.beginPath();
//       ctx.font = `${fontSize}px Arial`;
//       ctx.fillStyle = "#333";
//       ctx.fillText(
//         text,
//         config.font.x,
//         config.font.y
//       );

//       draw.Rect({
//         x:config.font.x - 6,
//         y:config.font.y - fontSize,
//         w: fontWidth,
//         h: fontSize + 6
//       },ctx)

//       data.network[layer].outputs.map((neuron,l)=>{
//         config.edges.to = config.edges.map[`${layer}_${l}`];
//         if (neuron > 0.9){
//           draw.Line({
//             x0:Math.floor(config.font.x + (fontWidth / 3)) ,
//             y0:Math.floor(config.font.y - fontSize ),
//             x1:config.edges.to.x,
//             y1:config.edges.to.y,
//             t:1,
//             c:`rgba(0,0,0,${neuron})`
//           },ctx)  
//         }
//       })
//     })
//   }


//   function drawNetwork(data){
//     let ctx = document.getElementById("graph").getContext("2d");
//     config.level.last = []

//     // Iterating levels to draw hierarchy
//     data.levels.map((level,i)=>{
//       let n = level.reduce((a,b) => a + data.network[b].outputs.length, 0); // Number of neurons in current level
//       config.level.width = Math.floor(
//         (n * 2 * config.neuron.radius ) + 
//         ((n + 1)*config.neuron.margin) + 
//         config.level.padding
//       ); // Current level width
//       config.layer.width = Math.floor(config.level.width/level.length) // Width of each layer in current level , change to dynamic adaption for variables size layers
      
//       // Iterating layers in current level
//       level.map((layer,j)=>{
//         config.layer.x = Math.floor(
//           (config.canvas.width/2) - 
//           (config.level.width/2) + 
//           (j*config.layer.width) - 
//           (config.level.height*(level.length-1)) + 
//           (config.level.height*2*(j))
//         ); 
//         config.layer.y = Math.floor(
//           config.canvas.padding + 
//           ( i * ( config.level.height +  ( 2 * config.level.margin ))) + 
//           50
//         );

//         draw.Rect({
//           x:config.layer.x,
//           y:config.layer.y,
//           h:config.level.height,
//           w:config.layer.width
//         },ctx)

//         if (i > 0){
//           config.level.last = data.levels[i-1];
//         }
//         // Rendering Neurons
//         data.network[layer].outputs.map((neuron,k)=>{
//           renderNeuron(ctx,config,neuron,k,layer);
//           // Rendering edges
//           renderEdges(ctx,config,data);

//         })
//       })
//     })
//     setOutput(ctx,config,data)
//   }