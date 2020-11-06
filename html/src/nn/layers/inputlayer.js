import { draw } from '../utils';

class InputLayer {
    constructor(args={data:{ class_name: "Dense", inbound: [], outbound: [], outputs: [], level: 0 }, ctx :CanvasRenderingContext2D, name:"Dense", network:{},parent:false}) {
        this.parent = args.parent
        this.data = args.data;
        this.ctx = args.ctx;
        this.name = args.name;
        this.config = {
            margin: 6,
            height: 64,
            width: 128
        }
    } // End constructor

    calculateWidth() {
        return this.config.width
    } // End calculateWidth

    calculateHeight() {
        return this.config.height
    } // End calculateHeight

    prepFunction_image(config, data) {

        let Ix = Math.floor(config.canvas.width / 2);
        let Iy = config.level.margin;

        this.ctx.beginPath()
        this.ctx.rect(Ix - 80, Iy, 144, 144)
        this.ctx.strokeStyle = "#333"
        this.ctx.lineWidth = 2;
        this.ctx.closePath();
        this.ctx.stroke()

        let image = new Image();
        image.onload = function () {
            document.getElementById("graph").getContext("2d").drawImage(image, Ix - 72, Iy + 8)
        }
        image.src = this.data.outputs;

        //  Setting tail for edge from next layer
        data.network[this.name].outputs = [1,]
        config.edges.map[`${this.name}_0`] = {
            x: Ix,
            y: Iy + 132
        }
    } // End prepFunction_image

    render(config, data) {
        this['prepFunction_' + data.input_config[this.name].type](config, data);
    } // End render

} // End InputLayer


export { InputLayer };