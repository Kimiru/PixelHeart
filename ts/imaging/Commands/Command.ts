import { GameObject, Input } from "../../../2DGameEngine/js/2DGameEngine.js"
import PixelHeartImage from "../PixelHeartImage.js"

export class Command {

    draw(ctx: CanvasRenderingContext2D) {

    }

}

export class CommandFactory extends GameObject {

    static pushCommand(command: Command) {

        window.dispatchEvent(new CustomEvent('PushCommand', { detail: { command } }))

    }

    static rebuildCommands() {

        window.dispatchEvent(new CustomEvent('Rebuild'))


    }

    static handle(dt: number, [width, height]: [number, number], color: string, input: Input) {

    }

}