import { ImageManipulator } from "../../2DGameEngine/js/2DGameEngine.js";
import { Vector } from "../../2DGameEngine/js/2DGEMath.js";
import PixelImage from "../PixelImage.js";
import Command from "./Command.js";
import SelectCommand from "./SelectCommand.js";

export default class RectangleCommand extends Command {

    imageManipulator
    layerNumber

    /**
     * 
     * @param {ImageManipulator} imageManipulator 
     */
    constructor(imageManipulator, layerNumber) {

        super()

        this.imageManipulator = imageManipulator
        this.layerNumber = layerNumber

    }

    /**
     * 
     * @param {PixelImage} pixelImage 
     */
    exec(pixelImage) {

        let calc = pixelImage.calcs[this.layerNumber]

        calc.ctx.drawImage(this.imageManipulator.canvas, 0, 0)

    }


    static plotLine(ctx, v0, v1, color) {

        let x0 = v0.x
        let y0 = v0.y
        let x1 = v1.x
        let y1 = v1.y

        let dx = Math.abs(x1 - x0)
        let sx = x0 < x1 ? 1 : -1
        let dy = -Math.abs(y1 - y0)
        let sy = y0 < y1 ? 1 : -1

        let error = dx + dy

        ctx.fillStyle = color

        while (true) {

            if (!SelectCommand.selectionRectangle || SelectCommand.selectionRectangle.contains(new Vector(x0, y0)))
                ctx.fillRect(x0, y0, 1, 1)
            if (x0 === x1 && y0 === y1) break
            let e2 = 2 * error
            if (e2 >= dy) {
                if (x0 == x1) break
                error += dy
                x0 += sx
            }
            if (e2 <= dx) {
                if (y0 == y1) break
                error += dx
                y0 += sy
            }

        }
    }

    static plotRect(ctx, v0, v1, color) {

        let v01 = new Vector(v0.x, v1.y)
        let v10 = new Vector(v1.x, v0.y)

        this.plotLine(ctx, v0, v10, color)
        this.plotLine(ctx, v1, v01, color)
        this.plotLine(ctx, v1, v10, color)

    }

    static baking = null
    static sourcePosition = null
    static lastPosition = null

    static hasCommandInBaking() { return this.baking !== null }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    static drawCommandInBaking(ctx) { ctx.drawImage(this.baking.canvas, 0, 0) }

    /**
     * Return a command when completed
     * 
     * @param {Input} input
     * @param {Vector} position 
     * @param {boolean} left 
     * @param {string} color 
     * @param {PixelImage} image
     */
    static use(input, mousePosition, lmb, color, image) {

        if (lmb) {

            if (!this.baking) this.baking = new ImageManipulator(image.width, image.height)
            if (!this.sourcePosition) this.sourcePosition = mousePosition.clone()
            if (this.lastPosition?.equal(mousePosition)) return

            this.baking.ctx.clearRect(0, 0, image.width, image.height)
            this.plotRect(this.baking.ctx, this.sourcePosition, mousePosition, color)
            this.lastPosition = mousePosition.clone()

        } else {

            this.sourcePosition = null
            this.lastPosition = null

            if (this.baking) {

                image.addCommand(new RectangleCommand(this.baking, image.activeCalcNumber))
                this.baking = null

            }

        }

    }

}