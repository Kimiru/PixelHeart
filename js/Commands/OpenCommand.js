import PixelImage from "../PixelImage.js";
import Command from "./Command.js";

export default class OpenCommand extends Command {

    imageManipulator

    constructor(imageManipulator) {

        super()

        this.imageManipulator = imageManipulator

    }

    /**
     * 
     * @param {PixelImage} pixelImage 
     */
    exec(pixelImage) {

        pixelImage.calcs = [this.imageManipulator.clone()]
        pixelImage.activeCalc = 0

    }

}