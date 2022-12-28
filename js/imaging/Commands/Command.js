import { GameObject } from "../../../2DGameEngine/js/2DGameEngine.js";
export class Command {
    draw(ctx) {
    }
}
export class CommandFactory extends GameObject {
    static pushCommand(command) {
        window.dispatchEvent(new CustomEvent('PushCommand', { detail: { command } }));
    }
    static rebuildCommands() {
        window.dispatchEvent(new CustomEvent('Rebuild'));
    }
    static handle(dt, [width, height], color, input) {
    }
}
