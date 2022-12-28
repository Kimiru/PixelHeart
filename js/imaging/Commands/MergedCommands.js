import { ImageManipulator } from "../../../2DGameEngine/js/2DGameEngine.js";
import { Command, CommandFactory } from "./Command.js";
export class MergedCommands extends Command {
    imageManipulator;
    constructor(imageManipulator) {
        super();
        this.imageManipulator = imageManipulator;
    }
    draw(ctx) {
        ctx.drawImage(this.imageManipulator.canvas, 0, 0);
    }
}
export class MergedCommandsFactory extends CommandFactory {
    static merge(size, ...commands) {
        let imageManipulator = new ImageManipulator(...size);
        for (let command of commands)
            command.draw(imageManipulator.ctx);
        return new MergedCommands(imageManipulator);
    }
}
