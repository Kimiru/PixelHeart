import { ImageManipulator, Vector } from "../../2DGameEngine/js/2DGameEngine.js";
import PixelImage from "../PixelImage.js";
import Command from "./Command.js";

export default class SourceCommand extends Command {

    /**
     * 
     * @param {PixelImage} pixelImage 
     */
    exec(pixelImage) {

        pixelImage.calcs = [new ImageManipulator(32, 32)]
        pixelImage.activeCalc = 0


    }

}