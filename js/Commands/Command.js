import { Input } from "../../2DGameEngine/js/2DGameEngine.js";
import PixelImage from "../PixelImage.js";

export default class Command {

    constructor() {
    }

    /**
     * 
     * @param {PixelImage} pixelImage 
     */
    exec(pixelImage) { }

    static hasCommandInBaking() { return false }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    static drawCommandInBaking(ctx) { }

    /**
     * 
     * @param {Input} input
     * @param {Vector} position 
     * @param {boolean} left 
     * @param {string} color 
     * @param {PixelImage} image
     */
    static use(input, mousePosition, lmb, color, image) { }

    /**
     * 
     * @param {PixelImage} image 
     */
    static startOfUse(image) { }

    /**
     * 
     * @param {PixelImage} image 
     */
    static endOfUse(image) { }

}