import { draw } from '../utils';

class Layer {
    constructor(data = { class_name: "Dense", inbound: [], outbound: [], outputs: [], level: 0 }, ctx = CanvasRenderingContext2D, name = "Layer") {
        this.data = data;
        this.ctx = ctx;
        this.name = name;
        this.config = {
            radius: 3,
            margin: 6,
            height: 0,
            width: 0,
            xmin:0,
            ymin:0,
            xmax:0,
            ymax:0,
            dy:0
        }
    } // End cunstructor

    calculateWidth() {
        this.config.width = (this.data.outputs.length * 2 * this.config.radius) +
            ((this.data.outputs.length + 3) * (this.config.margin));
        return this.config.width
    } // End calculateWidth

    calculateHeight() {
        this.config.height = 2 * (this.config.radius + 2 * this.config.margin);
        return this.config.height
    } // End calculateHeight

    popUp(i, x, y) {
        window.popped = false;

        let canv = document.createElement("div");
        let pop = document.getElementById("pop");
        
        canv.className = "popup";
        canv.innerText = String(this.data.outputs[i]).slice(0, 8);
        
        pop.innerHTML = '';
        pop.style.top = `${y}px`
        pop.style.left = `${x}px`
        pop.appendChild(canv)
        
        setTimeout(function () {
            window.popped = true;
        }, 100)
    } // End popUp

    renderNeuron(config, neuron, k) {
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

        draw.Circle({
            x: config.neuron.x,
            y: config.neuron.y,
            r: this.config.radius,
            c: `rgba(0,0,0,${neuron + 0.1})`
        }, this.ctx)
    } // End renderNeuron

    renderEdges(config, data, network) {
        let p1 = Math.floor(this.config.margin * 2.5), p2;
        this.data.inbound.map((layer, _) => {
            p2 = Math.floor(network[layer].config.margin * 2.5)
            if (this.data.level - data.network[layer].level > 1) {
                data.network[layer].outputs.map((neuron, l) => {
                    config.edges.to = config.edges.map[`${layer}_${l}`];
                    if (neuron > 1.8) {      
                        draw.Line({
                            x1:96, 
                            y1:config.edges.to.y + 48,
                            x0:config.edges.to.x,
                            y0:config.edges.to.y + p2,
                            c:'rgba(0,0,0,0.7)',
                            t:0.1
                        },this.ctx)
                        draw.Line({
                            x1:config.neuron.x, 
                            y1:config.neuron.y - p1,
                            x0:96, 
                            y0:config.edges.to.y + 48,
                            c:'rgba(0,0,0,0.7)',
                            t:0.1
                        },this.ctx)
                    }
                })
            } // End if -> render if level difference is less then 2 -> not skip connection
            else {
                data.network[layer].outputs.map((neuron, l) => {
                    config.edges.to = config.edges.map[`${layer}_${l}`];
                    if (neuron > 0.8) {
                        draw.Line({
                            x0: config.neuron.x,
                            y0: config.neuron.y - p1,
                            x1: config.edges.to.x,
                            y1: config.edges.to.y + p2,
                            t: 0.1,
                            c: `rgba(0,0,0,0.7)`
                        }, this.ctx)
                    }
                })
            }
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
            this.renderNeuron(config, neuron, k);
            this.renderEdges(config, data, network);
        })
    } // End render
}


export { Layer };