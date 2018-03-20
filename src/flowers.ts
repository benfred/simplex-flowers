import OpenSimplexNoise from "open-simplex-noise";

const noise = new OpenSimplexNoise(40);

export function drawFlower(ctx: CanvasRenderingContext2D,
                           circle: {x: number, y: number, radius: number},
                           frequency: number = 2.0, magnitude: number = 0.5,
                           independence: number = 0.1, spacing: number = 0.01,
                           count: number = 300): void {
    // adjust the radius so will have roughly the same size irregardless of magnitude
    let current = {...circle};
    current.radius /= (magnitude + 1);
    for (let i = 0; i < count; ++i) {
        // draw a circle, the final parameter controlling how similar it is to
        // other circles in this image
        drawDeformedCircle(ctx, current,
                           frequency, magnitude,
                           i * independence);

        // shrink the radius of the next circle
        current.radius *= (1 - spacing);
    }
}

export function drawDeformedCircle(ctx: CanvasRenderingContext2D,
                                   circle: {x: number, y: number, radius: number},
                                   frequency: number,
                                   magnitude: number,
                                   seed: number = 0): void {
        ctx.beginPath();

        // Sample points evenly around the circle
        const samples = Math.floor(4 * circle.radius + 20);
        for (let j = 0; j < samples + 1; ++j) {
            const angle = (2 * Math.PI * j) / samples;

            // Figure out the x/y coordinates for the given angle
            const x = Math.cos(angle);
            const y = Math.sin(angle);

            // Randomly deform the radius of the circle at this point
            const deformation = (noise.noise3D(x * frequency,
                                               y * frequency,
                                               seed) + 1);
            const radius = circle.radius * (1 + magnitude * deformation);

            // Extend the circle to this deformed radius
            ctx.lineTo(circle.x + radius * x,
                       circle.y + radius * y);
        }
        ctx.fill();
        ctx.stroke();
}


