import { GameObject, ImageManipulator } from "../2DGameEngine/js/2DGameEngine.js";
import Command from "./Commands/Command.js";
import Source from "./Commands/SourceCommand.js";

export default class PixelImage extends GameObject {

    /**
     * The current rendered calcs ordered from bottom to top
     * Each calc is represented by an ImageManipulator
     */
    calcs = [new ImageManipulator()]
    #calc = 0

    get activeCalc() { return this.calcs[this.#calc] }
    get activeCalcNumber() { return this.#calc }

    set activeCalc(calc) {

        if (calc < 0 || calc >= this.calcs.length) return

        this.#calc = calc
    }

    get width() { return this.activeCalc.canvas.width }

    set width(width) {

        let height = this.height

        this.calcs.forEach(calc => calc.setSize(width, height))

    }

    get height() { return this.activeCalc.canvas.height }

    set height(height) {

        let width = this.width

        this.calcs.forEach(calc => calc.setSize(width, height))

    }


    /**
     * A list of all commands used to obtained the current calc
     * First command cannot be poped
     */
    commands = []

    /**
     * A list of all the commands that have been cancel and not yet overridden
     */
    canceledCommands = []

    imageToDisplay = new ImageManipulator()

    constructor() {

        super()

        this.addCommand(new Source())

    }

    undo() {

        if (this.commands.length > 1) {

            this.canceledCommands.push(this.commands.pop())
            this.rerender()

        }

    }

    redo() {

        if (this.canceledCommands.length) {

            let command = this.canceledCommands.pop()

            command.exec(this)
            this.commands.push(command)

        }

    }

    rerender() {

        for (let command of this.commands)
            command.exec(this)

    }

    /**
     * 
     * @param {Command} command 
     */
    addCommand(command) {

        this.canceledCommands = []

        if (this.checkCommandUsefullness(command))
            this.commands.push(command)

    }

    /***
     * 
     * @param {Command} command
     */
    checkCommandUsefullness(command) {

        let preid = this.calcsID()

        command.exec(this)

        let postid = this.calcsID()

        return preid !== postid

    }

    calcsID() {

        let str = ''

        for (let calc of this.calcs) str += calc.print()

        return str

    }

    draw(ctx, tool) {

        for (let [index, calc] of Object.entries(this.calcs.map(o => o.clone()))) {

            if (Number(index) == this.activeCalcNumber)
                if (typeof tool === 'function' && tool.hasCommandInBaking()) {
                    tool.drawCommandInBaking(calc.ctx)
                }

            calc.executeDraw(ctx)

        }

    }

}