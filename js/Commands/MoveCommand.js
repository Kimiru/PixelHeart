import { ImageManipulator, Input, Rectangle, Vector } from "../../2DGameEngine/js/2DGameEngine.js";
import PixelImage from "../PixelImage.js";
import Command from "./Command.js";
import SelectCommand from "./SelectCommand.js";

export default class MoveCommand extends Command {

    imageManipulator
    source
    offset

    /**
     * 
     * @param {ImageManipulator} imageManipulator 
     */
    constructor(imageManipulator, source, offset, layerNumber) {

        super()

        this.imageManipulator = imageManipulator
        this.source = source
        this.offset = offset
        this.layerNumber = layerNumber

    }

    /**
     * 
     * @param {PixelImage} pixelImage 
     */
    exec(pixelImage) {

        let calc = pixelImage.calcs[this.layerNumber]

        console.log(this.source.bottomleft)

        calc.ctx.clearRect(this.source.left, this.source.bottom, this.source.w, this.source.h)
        calc.ctx.clearRect(this.source.left + this.offset.x, this.source.bottom + this.offset.y, this.source.w, this.source.h)

        calc.ctx.drawImage(this.imageManipulator.canvas, this.offset.x, this.offset.y)

    }


    static offset = new Vector()

    static source = new Rectangle()

    static baking = null
    static lastPosition = null

    static hasCommandInBaking() { return this.baking !== null }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    static drawCommandInBaking(ctx) {

        ctx.clearRect(this.source.left, this.source.bottom, this.source.w, this.source.h)
        ctx.clearRect(this.source.left + this.offset.x, this.source.bottom + this.offset.y, this.source.w, this.source.h)

        ctx.drawImage(this.baking.canvas, this.offset.x, this.offset.y)

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

        if (this.baking) {

            if (input.isPressed('ArrowRight')) {
                this.offset.x++
                SelectCommand.selectionRectangle.x++
            }
            if (input.isPressed('ArrowLeft')) {
                this.offset.x--
                SelectCommand.selectionRectangle.x--
            }
            if (input.isPressed('ArrowUp')) {
                this.offset.y--
                SelectCommand.selectionRectangle.y--
            }
            if (input.isPressed('ArrowDown')) {
                this.offset.y++
                SelectCommand.selectionRectangle.y++
            }

            this.baking.ctx.clearRect(this.source.left, this.source.bottom,
                this.source.w, this.source.h)
            this.baking.ctx.drawImage(image.activeCalc.canvas,
                this.source.left, this.source.bottom,
                this.source.w, this.source.h,
                this.source.left, this.source.bottom,
                this.source.w, this.source.h)

        }

    }

    static startOfUse(image) {

        if (SelectCommand.selectionRectangle) {

            this.source.transform.translation.copy(SelectCommand.selectionRectangle.transform.translation).addS(.5, .5)
            this.source.transform.scale.copy(SelectCommand.selectionRectangle.transform.scale)

            this.baking = new ImageManipulator(image.width, image.height)
            this.offset.set(0, 0)

        }

    }

    /**
     * 
     * @param {PixelImage} image 
     */
    static endOfUse(image) {

        if (this.baking) {

            let source = new Rectangle(this.source.x, this.source.y, this.source.w, this.source.h)
            let offset = this.offset.clone()

            let command = new MoveCommand(this.baking, source, offset, image.activeCalcNumber)
            image.addCommand(command)

        }

    }

}