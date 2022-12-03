import { ImageManipulator } from "../../2DGameEngine/js/2DGameEngine.js";
import { Rectangle } from "../../2DGameEngine/js/2DGEGeometry.js";
import { Vector } from "../../2DGameEngine/js/2DGEMath.js";
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

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {PixelImage} image 
     */
    static drawSelectionRectangle(ctx, image) {

        if (this.selectionRectangle) {

            ctx.save()
            ctx.scale(1 / image.width, -1 / image.height)
            ctx.setLineDash([])
            ctx.lineWidth = .2
            ctx.strokeStyle = 'blue'
            ctx.strokeRect(
                this.selectionRectangle.left - image.width / 2 + .5,
                this.selectionRectangle.bottom - image.height / 2 + .5,
                this.selectionRectangle.w, this.selectionRectangle.h)


            ctx.lineWidth = .2
            ctx.setLineDash([1, 1])


            ctx.beginPath()
            ctx.moveTo(-image.width / 2, this.selectionRectangle.bottom - image.height / 2 + .5)
            ctx.lineTo(this.selectionRectangle.left - image.width / 2 + .5,
                this.selectionRectangle.bottom - image.height / 2 + .5)
            ctx.moveTo(-image.width / 2, this.selectionRectangle.bottom - image.height / 2 + .5 + this.selectionRectangle.h)
            ctx.lineTo(this.selectionRectangle.left - image.width / 2 + .5,
                this.selectionRectangle.bottom - image.height / 2 + .5 + this.selectionRectangle.h)

            ctx.moveTo(this.selectionRectangle.left - image.width / 2 + .5, -image.height / 2)
            ctx.lineTo(this.selectionRectangle.left - image.width / 2 + .5,
                this.selectionRectangle.bottom - image.height / 2 + .5)
            ctx.moveTo(this.selectionRectangle.left - image.width / 2 + .5 + this.selectionRectangle.w, -image.height / 2)
            ctx.lineTo(this.selectionRectangle.left - image.width / 2 + .5 + this.selectionRectangle.w,
                this.selectionRectangle.bottom - image.height / 2 + .5)
            ctx.stroke()

            ctx.textAlign = 'right'
            ctx.textBaseline = 'top'
            ctx.fillStyle = 'lightgray'
            ctx.font = '1px sans-serif'
            ctx.fillText(Number(this.selectionRectangle.bottom + .5).toString(),
                -image.width / 2, this.selectionRectangle.bottom - image.height / 2 + .5)
            if (this.selectionRectangle.h > 1) {
                ctx.textBaseline = 'bottom'
                ctx.fillText(Number(this.selectionRectangle.top - .5).toString(),
                    -image.width / 2, this.selectionRectangle.bottom - image.height / 2 + .5 + this.selectionRectangle.h)
            }
            ctx.textBaseline = 'bottom'
            ctx.textAlign = 'left'
            ctx.fillText(Number(this.selectionRectangle.left + .5).toString(),
                this.selectionRectangle.left - image.width / 2 + .5, -image.height / 2)
            if (this.selectionRectangle.w > 1) {
                ctx.textAlign = 'right'
                ctx.fillText(Number(this.selectionRectangle.right - .5).toString(),
                    this.selectionRectangle.left - image.width / 2 + .5 + this.selectionRectangle.w, -image.height / 2)
            }

            if (this.selectionRectangle.h > 3) {

                ctx.textBaseline = 'middle'
                ctx.textAlign = 'right'

                ctx.fillText(Number(this.selectionRectangle.h).toString(),
                    -image.width / 2 - 1.5, -image.height / 2 + .5 + this.selectionRectangle.y)

            }

            if (this.selectionRectangle.w > 3) {

                ctx.textBaseline = 'bottom'
                ctx.textAlign = 'center'

                ctx.fillText(Number(this.selectionRectangle.w).toString(),
                    -image.width / 2 + .5 + this.selectionRectangle.x, -image.height / 2 - 1.5)

            }

            ctx.setLineDash([])

            ctx.restore()

        }

    }

}