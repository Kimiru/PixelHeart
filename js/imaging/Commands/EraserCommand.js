import { Vector } from "../../../2DGameEngine/js/2DGEMath.js";
import { ImageManipulator } from "../../../2DGameEngine/js/2DGameEngine.js";
import { Command, CommandFactory } from "./Command.js";
import { Selection } from "./SelectionCommand.js";
export class EraserCommand extends Command {
    imageManipulator;
    constructor(width, height) {
        super();
        this.imageManipulator = new ImageManipulator(width, height);
    }
    draw(ctx) {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.drawImage(this.imageManipulator.canvas, 0, 0);
        ctx.globalCompositeOperation = 'source-over';
    }
}
export class EraserCommandFactory extends CommandFactory {
    static lastMousePosition = null;
    static commandInBaking = null;
    static handle(dt, [width, height], color, input) {
        let mouse = input.mouse;
        if (mouse.left) {
            let position = mouse.position
                .clone()
                .mult(new Vector(1, -1))
                .addS(width / 2, height / 2)
                .floor();
            if (!this.lastMousePosition) {
                this.commandInBaking = new EraserCommand(width, height);
                CommandFactory.pushCommand(this.commandInBaking);
            }
            if (!this.lastMousePosition || !this.lastMousePosition.equal(position)) {
                if (!Selection.active || Selection.rectangle.contains(new Vector(position.x, position.y)))
                    this.commandInBaking.imageManipulator.setPixel(position.x, position.y, color);
                CommandFactory.rebuildCommands();
            }
            this.lastMousePosition = position.clone();
        }
        else if (this.lastMousePosition) {
            this.lastMousePosition = null;
            this.commandInBaking = null;
        }
    }
}
