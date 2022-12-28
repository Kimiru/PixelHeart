import { ImageManipulator } from "../../2DGameEngine/js/2DGameEngine.js"
import { Command } from "./Commands/Command.js"

export default class PixelHeartImage extends ImageManipulator {

    #commands: Command[] = []
    #redo: Command[] = []

    undo(): void {

        if (this.#commands.length) {

            const currentData = this.print()
            const command = this.#commands.pop()

            this.build()

            const nextData = this.print()

            if (currentData === nextData) this.undo()
            else this.#redo.push(command)

        }

    }

    redo(): void {

        if (this.#redo.length) {

            this.#commands.push(this.#redo.pop())

            this.build()

        }

    }

    pushCommand(command: Command): void {

        this.clean()

        this.#commands.push(command)
        command.draw(this.ctx)

        this.#redo = []

    }

    /**
     * Check if last command is useful
     * Removes it if unnecessary
     * 
     * @returns 
     */
    clean(): void {

        const commands = [...this.#commands]
        const lastCommand = commands.pop()

        if (!lastCommand) return

        const imageManipulator = new ImageManipulator(this.width, this.height)

        for (let command of commands)
            command.draw(imageManipulator.ctx)

        const currentData = imageManipulator.print()

        lastCommand.draw(imageManipulator.ctx)

        const nextData = imageManipulator.print()

        if (currentData === nextData) this.#commands.pop()

    }

    build(): void {

        this.ctx.clearRect(0, 0, this.width, this.height)

        for (let command of [...this.#commands])
            command.draw(this.ctx)

    }

    update(dt: number): void {

        this.transform.scale.set(this.width, this.height)

    }

    drawBackground(ctx) {

        ctx.fillStyle = '#ddddddaa'

        const pixelPerTile = 3
        let squaresWidth = (1 / pixelPerTile) / this.width
        let squaresHeight = (1 / pixelPerTile) / this.height


        for (let x = 0; x < this.width * pixelPerTile; x++) for (let y = 0; y < this.height * pixelPerTile; y++)
            if ((x & 1) ^ (y & 1))
                ctx.fillRect(
                    -.5 + x * squaresWidth,
                    -.5 + y * squaresHeight,
                    squaresWidth,
                    squaresHeight
                )
    }

    draw(ctx: CanvasRenderingContext2D): void {

        if (globalThis.vueApp.drawBackground)
            this.drawBackground(ctx)

        super.draw(ctx)

    }

}