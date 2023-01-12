import { Vector } from "../../../2DGameEngine/js/2DGEMath.js"
import { Input } from "../../../2DGameEngine/js/2DGameEngine.js"
import PixelHeartImage from "../PixelHeartImage.js"
import PixelHeartSpriteSheet from "../PixelHeartSpriteSheet.js"
import { CommandFactory } from "./Command.js"

export class ColorPickerCommandFactory extends CommandFactory {

    static handle(dt: number, [width, height]: [number, number], color: string, input: Input): void {

        let mouse = input.mouse

        if (mouse.left) {
            let image: PixelHeartImage = (globalThis.spriteSheet as PixelHeartSpriteSheet).currentImage
            let position = mouse.position
                .clone()
                .mult(new Vector(1, -1))
                .addS(width / 2, height / 2)
                .floor()

            let rawData: number[] = image.getPixel(position.x, position.y)
            globalThis.vueApp.alpha = rawData.pop()

            globalThis.vueApp.baseColor = '#' + rawData
                .map(value => Number(value).toString(16))
                .map(str => str.length < 2 ? '0' + str : str)
                .join('')
        }

    }

}