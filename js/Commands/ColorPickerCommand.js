import { Vector } from "../../2DGameEngine/js/2DGEMath.js";
import PixelImage from "../PixelImage.js";
import Command from "./Command.js";

export default class ColorPickerCommand extends Command {



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

            let data = image.activeCalc.getPixel(mousePosition.x, mousePosition.y)

            window.vm.alpha = data[3]
            data = data.map(o => Number(o).toString(16)).map(s => {

                if (s.length < 2) s = '0' + s

                return s

            })
            window.vm.baseColor = `#${data[0]}${data[1]}${data[2]}`

        } else {

        }

    }

}