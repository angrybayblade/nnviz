import { draw } from '../utils';

class Conv2D {
    constructor(args={data:{ class_name: "Dense", inbound: [], outbound: [], outputs: [], level: 0 }, ctx :CanvasRenderingContext2D, name:"Dense", network:{}}) {
        this.data = args.data;
        this.ctx = args.ctx;
        this.name = args.name;

        this.data.output_maps = [...this.data.outputs]
        this.config = {
            radius: 3,
            margin: 6,
            height: 0,
            width: 0,
        }
    } // End constructor

    popUp(i, x, y) {
        window.popped = false;
        let canv = document.createElement("div");
        let pop = document.getElementById("pop");

        canv.className = "popup-img";

        let img = document.createElement("img");
        img.src = this.data.output_maps[i][0];
        pop.innerHTML = '';

        canv.appendChild(img)
        pop.style.top = `${y}px`
        pop.style.left = `${x}px`

        pop.appendChild(canv)
        setTimeout(function () {
            window.popped = true;
        }, 100)
    } // End popUp

    calculateWidth() {
        this.config.width = (this.data.outputs.length * 2 * this.config.radius) +
            ((this.data.outputs.length + 3) * (this.config.margin));
        return this.config.width
    } // End calculateWidth

    calculateHeight() {
        this.config.height = 2 * (this.config.radius + 2 * this.config.margin);
        return this.config.height
    } // End calculateHeight

    renderMap(config, neuron, k) {
        config.neuron.y = (
            config.layer.y +
            this.config.radius +
            this.config.margin * 2
        );

        config.neuron.x = (
            config.layer.x +
            this.config.radius +
            (k * ((this.config.radius * 2) + this.config.margin)) +
            (2 * this.config.margin)
        )

        config.edges.map[`${this.name}_${k}`] = {
            x: config.neuron.x,
            y: config.neuron.y
        };

        config.edges.map[`${this.name}_${k}`] = {
            x: config.neuron.x,
            y: config.neuron.y
        };

        this.data.outputs[k] = 0.9

        draw.Circle({
            x: config.neuron.x,
            y: config.neuron.y,
            r: this.config.radius,
            c: `rgba(0,0,0,${neuron[1]})`
        }, this.ctx)
    } // End renderMap

    renderEdges(config, data, network) {
        let p1 = Math.floor(this.config.margin * 2.5), p2;
        this.data.inbound.map((layer, _) => {
            p2 = Math.floor(network[layer].config.margin * 2.5)
            data.network[layer].outputs.map((neuron, l) => {
                config.edges.to = config.edges.map[`${layer}_${l}`];
                if (neuron > 0.8) {
                    draw.Line({
                        x0: config.neuron.x,
                        y0: config.neuron.y - p1,
                        x1: config.edges.to.x,
                        y1: config.edges.to.y + p2,
                        t: 0.1,
                        c: `rgba(0,0,0,0.15)`
                    }, this.ctx)
                }
            })
        })
    } // End renderEdges

    render(config, data, network) {
        this.config.xmin = config.layer.x;
        this.config.ymin = config.layer.y - config.level.margin;
        
        this.config.xmax = Math.floor(this.config.xmin + this.config.width);
        this.config.ymax = Math.floor(this.config.ymin + config.level.height);

        this.config.dx = (2*this.config.radius) + this.config.margin;
        
        draw.Rect({
            x: config.layer.x,
            y: config.layer.y,
            h: config.level.height,
            w: this.config.width
        }, this.ctx)

        // Rendering Neurons
        this.data.outputs.map((neuron, k) => {
            this.renderMap(config, neuron, k);
            this.renderEdges(config, data, network);
        })
    } // End render
} // End Conv2D


export {Conv2D};