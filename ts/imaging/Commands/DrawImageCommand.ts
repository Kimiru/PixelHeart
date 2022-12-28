import { Command } from "./Command.js";

export class DrawImageCommand extends Command {

    image: HTMLImageElement

    constructor(image: HTMLImageElement) {

        super()

        this.image = image

    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.drawImage(this.image, 0, 0)

    }

}
