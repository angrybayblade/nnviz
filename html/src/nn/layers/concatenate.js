import { draw } from '../utils';

class Concatenate {
    constructor(data = { class_name: "Dense", inbound: [], outbound: [], outputs: [], level: 0 }, ctx = CanvasRenderingContext2D) {
        this.data = data;
        this.ctx = ctx;
    } // End constrctor
} // End Concatenate


export {Concatenate};