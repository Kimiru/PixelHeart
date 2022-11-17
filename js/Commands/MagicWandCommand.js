import { ImageManipulator } from "../../2DGameEngine/js/2DGameEngine.js";
import { Rectangle } from "../../2DGameEngine/js/2DGEGeometry.js";
import { Vector } from "../../2DGameEngine/js/2DGEMath.js";
import PixelImage from "../PixelImage.js";
import Command from "./Command.js";
import SelectCommand from "./SelectCommand.js";

export default class MagicWandCommand extends Command {

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


    static baking = null
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
            if (this.lastPosition?.equal(mousePosition)) return

            this.baking.ctx.clearRect(0, 0, image.width, image.height)
            this.wand(image, mousePosition, color)
            this.lastPosition = mousePosition.clone()

        } else {

            this.lastPosition = null

            if (this.baking) {

                image.addCommand(new MagicWandCommand(this.baking, image.activeCalcNumber))
                this.baking = null

            }

        }

    }

    static colorAt(image, position) { return image.activeCalc.getPixel(position.x, position.y).map(n => Number(n).toString()).join('_') }

    /**
     * 
     * @param {PixelImage} image 
     * @param {Vector} position 
     * @param {string} color 
     */
    static wand(image, position, color) {

        let open = []
        let close = []

        let window = new Rectangle(0, 0, image.width - 1, image.height - 1)
        window.bottomleft = new Vector(0, 0)

        if (!window.contains(position)) return

        let sourceColor = this.colorAt(image, position)

        open.push(position)

        for (let x = 0; x < image.width; x++)
            for (let y = 0; y < image.height; y++)
                if (this.colorAt(image, new Vector(x, y)) === sourceColor)
                    this.baking.setPixel(x, y, color)


    }

}