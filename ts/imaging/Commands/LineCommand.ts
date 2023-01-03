import { Vector } from "../../../2DGameEngine/js/2DGEMath.js"
import { Input } from "../../../2DGameEngine/js/2DGameEngine.js"
import { Command, CommandFactory } from "./Command.js"

export class LineCommand extends Command {

    v0: Vector
    v1: Vector
    color: string

    constructor(v0: Vector, v1: Vector, color: string) {

        super()

        this.v0 = v0
        this.v1 = v1
        this.color = color

    }

    plotLine(ctx, v0, v1, color) {

        let x0 = v0.x
        let y0 = v0.y
        let x1 = v1.x
        let y1 = v1.y

        let dx = Math.abs(x1 - x0)
        let sx = x0 < x1 ? 1 : -1
        let dy = -Math.abs(y1 - y0)
        let sy = y0 < y1 ? 1 : -1

        let error = dx + dy

        ctx.fillStyle = color

        while (true) {

            // TODO
            // if (!SelectCommand.selectionRectangle || SelectCommand.selectionRectangle.contains(new Vector(x0, y0)))
            ctx.fillRect(x0, y0, 1, 1)
            if (x0 === x1 && y0 === y1) break
            let e2 = 2 * error
            if (e2 >= dy) {
                if (x0 == x1) break
                error += dy
                x0 += sx
            }
            if (e2 <= dx) {
                if (y0 == y1) break
                error += dx
                y0 += sy
            }

        }
    }

    draw(ctx: CanvasRenderingContext2D): void {

        this.plotLine(ctx, this.v0, this.v1, this.color)

    }

}

export class LineCommandFactory extends CommandFactory {

    static lastMousePosition: Vector = null
    static commandInBaking: LineCommand = null

    static handle(dt: number, [width, height]: [number, number], color: string, input: Input): void {

        let mouse = input.mouse

        if (mouse.left) {

            let position = mouse.position
                .clone()
                .mult(new Vector(1, -1))
                .addS(width / 2, height / 2)
                .floor()

            if (!this.lastMousePosition) {

                this.commandInBaking = new LineCommand(position.clone(), position.clone(), color)

                CommandFactory.pushCommand(this.commandInBaking)

            }

            if (!this.lastMousePosition || !this.lastMousePosition.equal(position)) {

                this.commandInBaking.v1.copy(position)

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