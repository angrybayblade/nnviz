import * as Utils from './utils';
import { layers } from "./layers";

class Network {
    constructor(
        data = { 
            network: {}, 
            levels: [], 
            output_class: [], 
            input: [] 
        }, ctx = CanvasRenderingContext2D, canvas = undefined
    ) {
        
        this.config = {
            network: { height: 0},
            canvas: { margin: 30, padding: 192, width: 0, height: 0 },
            level: { height: 0, width: 0, x: 0, y: 0, margin: 96, last: [], depth: 0 },
            neuron: { max: 0, x: 0, y: 0, },
            layer: { x: 0, y: 0, width: 0, padding: 8 ,marginHr:48},
            edges: { to: {}, map: {} },
            font: { x: 0, y: 0 }
        }

        this.data = data;
        this.ctx = ctx;
        this.canvas = canvas;
        this.model = {};

        Object.keys(this.data.network).map((name, i) => {
            let layer = this.data.network[name];
            let args = {
                data :layer, 
                ctx : this.ctx, 
                name:name, 
                network:this.data.network
            }
            this.model[name] = new layers[layer.class_name](args);
        }, 100)
        window.network = this.model;
    }

    setupCanvas() {
        this.config.canvas.width = Math.max(
            (window.innerWidth - 5),
            Math.max(...this.data.levels.map((level) => {
                return level.map((layer, _) => {
                    return this.model[layer].calculateWidth() + (2 * this.config.canvas.padding);
                }).reduce(function (a, b) {
                    return a + b;
                }, 0)
            })
            )
        ); // End Math.max

        this.config.canvas.height = this.config.level.margin + this.data.levels.map((level) => {
            return (this.config.level.margin) + Math.max(...level.map((layer, _) => {
                return this.model[layer].calculateHeight();
            }))
        }).reduce(function (a, b) {
            return a + b;
        }); // this.data.levels.map

        this.canvas.width = this.config.canvas.width;
        this.canvas.height = this.config.canvas.height + (this.config.level.margin * 2);
        this.canvas.style.overflow = "hidden";

        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.config.canvas.width, this.config.canvas.height + (this.config.level.margin * 2));
        this.ctx.fillStyle = "white";
        this.ctx.closePath()
        this.ctx.fill()

    } // End setupCanvas

    setOutput() {
        this.config.font.y = this.config.network.height + (2 * this.config.level.margin) + 16;
        Object.keys(this.data.output_class).map((layer, i) => {
            let text = this.data.output_class[layer] + ' ';
            let textMetrics = this.ctx.measureText(text);
            let fontSize = 30;
            let fontWidth = Math.floor(textMetrics.width * (fontSize / 9));

            this.config.font.x = Math.floor(
                (this.config.canvas.width / 2) - 
                (fontWidth / 2.25)
            ); // End Math.floor

            this.ctx.beginPath();
            this.ctx.font = `${fontSize}px Arial`;
            this.ctx.fillStyle = "#333";
            this.ctx.fillText(
                text,
                this.config.font.x,
                this.config.font.y
            );

            Utils.draw.Rect({
                x: this.config.font.x - 6,
                y: this.config.font.y - fontSize,
                w: fontWidth,
                h: fontSize + 6
            }, this.ctx)

            this.data.network[layer].outputs.map((neuron, l) => {
                this.config.edges.to = this.config.edges.map[`${layer}_${l}`];
                if (neuron > 0.9) {
                    Utils.draw.Line({
                        x0: Math.floor(this.config.font.x + (fontWidth / 3)),
                        y0: Math.floor(this.config.font.y - fontSize),
                        x1: this.config.edges.to.x,
                        y1: this.config.edges.to.y,
                        t: 1,
                        c: `rgba(0,0,0,${neuron})`
                    }, this.ctx)
                }
            }) // End this.data.network[layer].outputs.map
        }) // Object.keys(this.data.output_class).map
    } // End setOutput

    render() {
        let marginHR = this.config.layer.marginHr;
        this.data.levels.map((level, i) => {
            this.config.level.width = level.map((layer, _) => {
                return this.model[layer].config.width + this.config.layer.marginHr;
            }).reduce(function (a, b) {
                return a + b;
            }, 0) - marginHR; // End reduce -> level.map

            this.config.level.height = Math.max(...level.map((layer, _) => {
                return this.model[layer].config.height;
            }))

            // Iterating layers in current level
            level.map((layer, j) => {
                console.log(`[Network] Rendering ${layer} at level ${i}`)
                this.config.layer.x = Math.floor(
                    (this.config.canvas.width / 2) -
                    (this.config.level.width / 2) 
                    
                ); // End Math.floor
                if (j > 0){
                    this.config.layer.x += level.slice(0,j).reduce(function (a, b) {
                        return a + window.network[b].config.width + marginHR;
                    }, 0)
                }

                this.config.layer.y = (2 * this.config.level.margin) + this.config.network.height;
                this.model[layer].render(this.config, this.data, this.model)
            })
            this.config.network.height += (
                this.config.level.height +
                this.config.level.margin
            )
        }) // End this.data.levels.map
        this.setOutput();
    } // End Render

    addHandler() {
        window.config = this.config;
        window.model = this.model;

        this.canvas.onclick = function (e) {
            let x = e.pageX;
            let y = e.pageY - window.config.level.margin;
            let layer;
            let i;

            [...Object.keys(window.model)].map((_layer,i)=>{
                layer = window.model[_layer];
                if (x >= layer.config.xmin && x <= layer.config.xmax &&
                    y >= layer.config.ymin && y <= layer.config.ymax){
                    i = Math.floor((x - layer.config.xmin)/layer.config.dx) - 1;
                    if ( i > -1){
                        layer.popUp(
                            i,
                            x,
                            y+window.config.level.margin
                        )
                    }
                    // finish popup
                }
            })

        } // End function (e)
    } // End addHandler
} // End class Network

export {Network}
