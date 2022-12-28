import { Command } from "./Command.js";
export class DrawImageCommand extends Command {
    image;
    constructor(image) {
        super();
        this.image = image;
    }
    draw(ctx) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.drawImage(this.image, 0, 0);
    }
}
