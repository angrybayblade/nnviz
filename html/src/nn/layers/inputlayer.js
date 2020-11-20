import { draw } from '../utils';

class ImageInput{
    constructor(){

    }
}

class RowWithColumnsInput{
    constructor(args={
        data:{ class_name:"InputLayer", inbound:[], outbound:[], outputs:[], level:0, },
        ctx:CanvasRenderingContext2D,
    }){
        this.class_name = args.data.class_name;
        this.inbound = args.data.inbound;
        this.outbound = args.data.outbound;
        this.level = args.data.level;
        this.outputs = args.data.outputs;
        this.ctx = args.ctx;

        this.config = {
            height:0,
            width:0,
            margin:3,
            font:{
                size:30,
                width:0,
                matric:undefined
            },
            xmin:0,
            ymin:0,
            xmax:0,
            ymax:0
        }
    }

    calculateWidth(){
        this.config.width = this.outputs.reduce((a,col)=>{
            let [ key,val ] = col;
            let matric = this.ctx.measureText(key);
            return a + Math.floor(matric.width * (this.config.font.size / 9));
        },0) + ( ( this.outputs.length - 1 )*this.config.margin )
        return this.config.width
    }

    calculateHeight(){
        this.config.height = ( this.config.font.size + 6 ) * 2 + (this.config.margin*2);
        return this.config.height
    }

    log(...data){
        console.log('[RowWithColumns] ',data);
    }

    render(netConfig,netData,model){
        this.config.xmin = netConfig.layer.x;
        this.config.ymin = netConfig.layer.y - netConfig.level.margin;
        
        this.config.xmax = Math.floor(this.config.xmin + this.config.width);
        this.config.ymax = Math.floor(this.config.ymin + netConfig.level.height);

        draw.Rect({
            x: netConfig.layer.x,
            y: netConfig.layer.y,
            h: netConfig.level.height,
            w: this.config.width
        }, this.ctx)
        
        console.log(this.config);

        draw.Line({
            x0:this.config.xmin,
            y0:this.config.ymin, //+ Math.floor( this.config.height / 2 ),
            x1:this.config.xmax,
            y1:this.config.ymin,// + Math.floor( this.config.height / 2 )
        },this.ctx)

        this.outputs.forEach((col,i)=>{
            let [key,val] = col;
        })
    }

}

const input_layers = {
    rowwithcolumn:RowWithColumnsInput,
    image:ImageInput
}

function InputLayer(args={
        data:{ class_name: "InputLayer", inbound: [], outbound: [], outputs: [], level: 0 ,render_config:{ type:'row' }}, 
        ctx :CanvasRenderingContext2D, 
        name:"Dense", 
        network:{}
    }) {
    return new input_layers[args.data.render_config.type](args)
} // End constructor

export { InputLayer };










    // prepFunction_image(config, data) {

    //     let Ix = Math.floor(config.canvas.width / 2);
    //     let Iy = config.level.margin;

    //     this.ctx.beginPath()
    //     this.ctx.rect(Ix - 80, Iy, 144, 144)
    //     this.ctx.strokeStyle = "#333"
    //     this.ctx.lineWidth = 2;
    //     this.ctx.closePath();
    //     this.ctx.stroke()

    //     let image = new Image();
    //     image.onload = function () {
    //         document.getElementById("graph").getContext("2d").drawImage(image, Ix - 72, Iy + 8)
    //     }
    //     image.src = this.data.outputs;

    //     //  Setting tail for edge from next layer
    //     data.network[this.name].outputs = [1,]
    //     config.edges.map[`${this.name}_0`] = {
    //         x: Ix,
    //         y: Iy + 132
    //     }
    // } // End prepFunction_image

    // render(config, data) {
    //     console.log(data);
    // } // End render
