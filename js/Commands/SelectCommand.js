import { ImageManipulator, Rectangle, Vector } from "../../2DGameEngine/js/2DGameEngine.js";
import PixelImage from "../PixelImage.js";
import Command from "./Command.js";

export default class SelectCommand extends Command {

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


    static hadSelection = false
    static sourcePosition = null
    static lastPosition = null

    static selectionRectangle = null

    static hasCommandInBaking() { return false }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    static drawCommandInBaking(ctx) { }

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

            if (!this.sourcePosition) {
                this.sourcePosition = mousePosition.clone()
                this.hadSelection = this.selectionRectangle != null
            }
            if (this.lastPosition?.equal(mousePosition)) return
            this.lastPosition = mousePosition.clone()

            let delta = this.sourcePosition.clone().sub(this.lastPosition).abs().addS(1, 1)
            let center = this.sourcePosition.clone().add(this.lastPosition).divS(2)//.subS(image.width / 2, image.height / 2)
            this.selectionRectangle = new Rectangle(center.x, center.y, delta.x, delta.y)


        } else {

            if (this.sourcePosition) {

                let delta = this.sourcePosition.clone().sub(this.lastPosition).abs().addS(1, 1)

                if (this.selectionRectangle && delta.equalS(1, 1) && this.hadSelection)
                    this.selectionRectangle = null

            }

            this.sourcePosition = null
            this.lastPosition = null

        }
    }

    static drawSelectionRectangle(ctx, image) {

        if (this.selectionRectangle) {

            ctx.save()
            ctx.scale(1 / image.width, -1 / image.height)
            ctx.lineWidth = .2
            ctx.strokeStyle = 'blue'
            ctx.strokeRect(
                this.selectionRectangle.left - image.width / 2 + .5,
                this.selectionRectangle.bottom - image.height / 2 + .5,
                this.selectionRectangle.w, this.selectionRectangle.h)
            ctx.restore()

        }

    }

}