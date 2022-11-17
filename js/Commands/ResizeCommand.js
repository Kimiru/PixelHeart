import PixelImage from "../PixelImage.js";
import Command from "./Command.js";

export default class ResizeCommand extends Command {

    width
    height

    constructor(width, height) {

        super()

        this.width = width
        this.height = height

    }

    /**
     * 
     * @param {PixelImage} pixelImage 
     */
    exec(pixelImage) {

        pixelImage.setSize(this.width, this.height)


    }

}