import { Vector } from "../../../2DGameEngine/js/2DGEMath.js"
import { ImageManipulator, Input } from "../../../2DGameEngine/js/2DGameEngine.js"
import { Command, CommandFactory } from "./Command.js"

export class PenCommand extends Command {

    imageManipulator: ImageManipulator

    constructor(width: number, height: number) {

        super()

        this.imageManipulator = new ImageManipulator(width, height)

    }

    draw(ctx: CanvasRenderingContext2D) {

        ctx.drawImage(this.imageManipulator.canvas, 0, 0)

    }

}

export class PenCommandFactory extends CommandFactory {

    static lastMousePosition: Vector = null
    static commandInBaking: PenCommand = null

    static handle(dt: number, [width, height]: [number, number], color: string, input: Input) {

        let mouse = input.mouse

        if (mouse.left) {

            let position = mouse.position
                .clone()
                .mult(new Vector(1, -1))
                .addS(width / 2, height / 2)
                .floor()

            if (!this.lastMousePosition) {

                this.commandInBaking = new PenCommand(width, height)

                CommandFactory.pushCommand(this.commandInBaking)

            }

            if (!this.lastMousePosition || !this.lastMousePosition.equal(position)) {

                this.commandInBaking.imageManipulator.ctx.fillStyle = color
                this.commandInBaking.imageManipulator.ctx.fillRect(position.x, position.y, 1, 1)

                CommandFactory.rebuildCommands()

            }

            this.lastMousePosition = position.clone()

        }
        else if (this.lastMousePosition) {

            this.lastMousePosition = null
            this.commandInBaking = null

        }

    }

}