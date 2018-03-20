export * from "./flowers";

import {drawFlower} from "./flowers";
import Slider from "slideyslider"

/// Draws a 2x2 grid of flowers, used as example image here
export function drawExampleGrid(element: HTMLElement) {
    let width = element.offsetWidth;
    let height = width > 650 ? width / 2 : 3 * width / 4;
    width = height;

    const layer = createCanvas(element, width, height, "layer");

    // super scale this so it looks good on hi-dpi monitors
    width *= 2;
    height *= 2;
    layer.width = width;
    layer.height = height;

    const ctx = layer.getContext("2d");

    // rose like
    const radius = .8 * height / 4;
    ctx.fillStyle = "white";
    ctx.strokeStyle = "rgba(250, 105, 180, .8)";
    drawFlower(ctx, {x: width / 4, y: height / 4, radius},
               2.0, 0.5, 0.1, 0.01, 300);

    // lily like
    ctx.strokeStyle = "rgba(250, 105, 180, .5)";
    ctx.fillStyle = "white";
    ctx.lineWidth = 1;
    drawFlower(ctx, {x: 3 * width / 4, y: 3 * height / 4, radius},
               8.5, .5, 0.0, 0.02, 150);

    // dandelion like
    ctx.fillStyle = "rgba(138, 207, 240, 1.0)";
    ctx.fillRect(width/2, 0, width/2, height/2);
    ctx.strokeStyle = "rgba(255,255,0, .3)";
    ctx.fillStyle = "rgba(255,165,0, .1)"
    ctx.lineWidth = 2;
    drawFlower(ctx, {x: 3 * width / 4, y: height / 4, radius},
               9, 0.2, 1.0, 0.02, 300);

    // dahlia? like
    ctx.fillStyle = "rgba(138, 207, 240, .2)";
    ctx.fillRect(0, height/2, width/2, height/2);
    ctx.lineWidth = 1;
    ctx.fillStyle = "white";
    drawFlower(ctx, {x: width / 4, y: 3 * height / 4, radius},
               8.72, 0.07, 0.15, 0.01, 1);
    ctx.fillStyle = "rgba(255,255,255, 0.0)";
    ctx.strokeStyle = "rgba(255,165,0, .5)"
    drawFlower(ctx, {x: width / 4, y: 3 * height / 4, radius},
               8.72, 0.07, 0.15, 0.01, 500);

}

// Interactive demo with sliders to set parameters passed to drawFlower
export class InteractiveDemo {
    public frequencySlider: Slider;
    public independenceSlider: Slider;
    public spacingSlider: Slider;
    public magnitudeSlider: Slider;
    public ctx: CanvasRenderingContext2D;
    public width: number;
    public height: number;

    public frequency: number = 2.15;
    public magnitude: number = 0.5;
    public independence: number = 0.15;
    public spacing: number = 0.015;
    public count: number = 200;

    constructor(element: HTMLElement, circleDemo: boolean = false) {
        let width = element.offsetWidth;
        let height = width > 650 ? width / 2 : 3 * width / 4;

        element = element.appendChild(document.createElement("div"));
        element.className = "container";
        element = element.appendChild(document.createElement("div"));
        element.className = "row";

       const layer = createCanvas(element, width, height, "layer");

        // super scale this so it looks good on hi-dpi monitors
        width *= 2;
        height *= 2;
        layer.width = width;
        layer.height = height;

        this.ctx = layer.getContext("2d");
        this.ctx.fillStyle = "white";
        this.ctx.strokeStyle = "rgba(250, 105, 180, .8)";

        this.width = width;
        this.height = height;

        this.frequencySlider = new Slider(element, "frequency",
            (rate) => {
                        this.frequency = rate;
                        this.frequencySlider.move(rate);
                        this.drawFlower();
                       },
            {domain: [0, 10],
             format: (rate) => rate.toPrecision(3),
             initial: this.frequency,
             tickFormat: (rate) => rate.toString(),
            });

        this.magnitudeSlider = new Slider(element, "magnitude",
            (rate) => {
                this.magnitude = rate;
                this.drawFlower();
            },
            {domain: [0, 1],
             format: (rate) => rate.toPrecision(3),
             initial: this.magnitude,
             tickFormat: (rate) => rate.toPrecision(1),
            });

        if (!circleDemo) {
            this.independenceSlider = new Slider(element, "independence",
                (rate) => {
                    this.independence = rate;
                    this.drawFlower();
                },
                {domain: [0, 1],
                format: (rate) => rate.toPrecision(3),
                initial: this.independence,
                tickFormat: (rate) => rate.toPrecision(1),
                });

            this.spacingSlider = new Slider(element, "spacing",
                (rate) => {
                    this.spacing = rate;
                    this.drawFlower();
                },
                {domain: [0.005, 0.2],
                format: (rate) => rate.toPrecision(3),
                initial: this.spacing,
                ticks: 3,
                tickFormat: (rate) => rate.toPrecision(1),
                });
        } else {
            this.ctx.strokeStyle = "rgba(255,165,0, .8)"
            this.ctx.fillStyle = "rgba(255,255,0, .1)";
            this.ctx.lineWidth = 10;
            this.count = 1;
        }
        this.drawFlower();
    }

    public drawFlower(): void {
        this.ctx.clearRect(0, 0, this.width, this.height);
        drawFlower(this.ctx, {x: this.width / 2, y: this.height / 2, radius: .8 * this.height/2},
                   this.frequency, this.magnitude, this.independence, this.spacing, this.count);
    }
}

// Setups up divs/ canvas like we expect here
export function createCanvas(element: HTMLElement,
                             width: number,
                             height: number,
                             className: string): HTMLCanvasElement {
    const inner: HTMLElement = document.createElement("div");
    inner.className = "simulation";
    inner.style.position = "relative";
    inner.style.width = width + "px";
    inner.style.height = height + "px";
    element.insertBefore(inner, element.childNodes[0]);

    const ret: HTMLCanvasElement = document.createElement("canvas");
    ret.className = className;

    ret.style.width = width + "px";
    ret.style.height = height + "px";
    ret.width = width;
    ret.height = height;
    ret.style.position = "absolute";
    ret.style.left = "0px";
    ret.style.top = "0px";

    inner.appendChild(ret);
    return ret;
}
