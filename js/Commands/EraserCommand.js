import { ImageManipulator } from "../../2DGameEngine/js/2DGameEngine.js";
import { Vector } from "../../2DGameEngine/js/2DGEMath.js";
import PixelImage from "../PixelImage.js";
import Command from "./Command.js";
import SelectCommand from "./SelectCommand.js";

export default class EraserCommand extends Command {

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

        calc.ctx.globalCompositeOperation = 'destination-out'

        calc.ctx.drawImage(this.imageManipulator.canvas, 0, 0)

        calc.ctx.globalCompositeOperation = 'source-over'

    }


    static baking = null
    static lastPosition = null

    static hasCommandInBaking() { return this.baking !== null }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    static drawCommandInBaking(ctx) {

        ctx.globalCompositeOperation = 'destination-out'

        ctx.drawImage(this.baking.canvas, 0, 0)

        ctx.globalCompositeOperation = 'source-over'


    }

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
            if (this.lastPosition?.equal(mousePosition)) return

            if (!SelectCommand.selectionRectangle || SelectCommand.selectionRectangle.contains(mousePosition))
                this.baking.setPixel(mousePosition.x, mousePosition.y, color)
            this.lastPosition = mousePosition.clone()

        } else {

            this.lastPosition = null

            if (this.baking) {

                image.addCommand(new EraserCommand(this.baking, image.activeCalcNumber))
                this.baking = null

            }

        }

    }

}