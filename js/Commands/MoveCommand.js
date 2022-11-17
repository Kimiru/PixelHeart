import { ImageManipulator, Input } from "../../2DGameEngine/js/2DGameEngine.js";
import { Rectangle } from "../../2DGameEngine/js/2DGEGeometry.js";
import { Vector } from "../../2DGameEngine/js/2DGEMath.js";
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

        calc.ctx.clearRect(this.source.left, this.source.bottom, this.source.w, this.source.h)
        calc.ctx.clearRect(this.source.left + this.offset.x, this.source.bottom + this.offset.y, this.source.w, this.source.h)

        calc.ctx.drawImage(this.imageManipulator.canvas, this.source.left + this.offset.x, this.source.bottom + this.offset.y)

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

        ctx.drawImage(this.baking.canvas, this.source.left + this.offset.x, this.source.bottom + this.offset.y)

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

            if (!this.isCopy) {

                this.baking.ctx.clearRect(0, 0,
                    this.source.w, this.source.h)
                this.baking.ctx.drawImage(image.activeCalc.canvas,
                    this.source.left, this.source.bottom,
                    this.source.w, this.source.h,
                    0, 0,
                    this.source.w, this.source.h)

                this.isCopy = true

            }

        }

    }

    static startOfUse(image) {

        if (SelectCommand.selectionRectangle && !this.baking) {

            this.source.copy(SelectCommand.selectionRectangle)
            this.source.transform.translation.addS(.5, .5)

            this.baking = new ImageManipulator(this.source.w, this.source.h)
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
            this.baking = null

        }

        this.isCopy = false

    }


    static copiedZone = null
    static copySource = null
    static isCopy = false

    /**
     * 
     * @param {PixelImage} image 
     */
    static copy(image) {

        if (SelectCommand.selectionRectangle) {

            let imageManipulator = new ImageManipulator(SelectCommand.selectionRectangle.w, SelectCommand.selectionRectangle.h)

            let rect = SelectCommand.selectionRectangle.clone()
            rect.transform.translation.addS(.5, .5)

            imageManipulator.ctx.drawImage(image.activeCalc.canvas,
                rect.left, rect.bottom,
                rect.w, rect.h,
                0, 0,
                rect.w, rect.h)

            this.copiedZone = imageManipulator
            this.copySource = SelectCommand.selectionRectangle.clone()

        }
    }


    /**
     * 
     * @param {PixelImage} image 
     */
    static paste(image) {

        if (!this.baking) {

            this.isCopy = true

            this.baking = this.copiedZone.clone()
            this.source.copy(this.copySource)
            this.source.transform.translation.addS(.5, .5)

            SelectCommand.selectionRectangle = SelectCommand.selectionRectangle ?? this.copySource.clone()
            SelectCommand.selectionRectangle.copy(this.copySource)

            this.offset.set(0, 0).sub(new Vector(image.width, image.height).sub(this.source.bottomleft))

            this.source.bottomleft = new Vector(image.width, image.height)

        }

    }

}