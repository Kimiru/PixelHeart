import { Command, CommandFactory } from "./Command.js";
import { Rectangle } from '../../../2DGameEngine/js/2DGEGeometry.js';
import { Vector } from "../../../2DGameEngine/js/2DGEMath.js";
export class SelectionCommand extends Command {
    draw(ctx) {
    }
}
export class SelectionCommandFactory extends CommandFactory {
    static originMousePosition = null;
    static lastMousePosition = null;
    static hadSelection = false;
    static handle(dt, [width, height], color, input) {
        let mouse = input.mouse;
        if (mouse.left) {
            let position = mouse.position
                .clone()
                .mult(new Vector(1, -1))
                .addS(width / 2, height / 2)
                .floor();
            if (!this.originMousePosition) {
                this.originMousePosition = position.clone();
                this.hadSelection = Selection.active;
                Selection.active = true;
            }
            this.lastMousePosition = position.clone();
            let delta = this.originMousePosition.clone().sub(this.lastMousePosition).abs().addS(1, 1);
            let center = this.originMousePosition.clone().add(this.lastMousePosition).divS(2); //.subS(image.width / 2, image.height / 2)
            Selection.rectangle.transform.translation.set(center.x, center.y);
            Selection.rectangle.transform.scale.set(delta.x, delta.y);
        }
        else {
            if (this.originMousePosition) {
                let delta = this.originMousePosition.clone().sub(this.lastMousePosition).abs().addS(1, 1);
                if (this.hadSelection && delta.equalS(1, 1))
                    Selection.active = false;
                console.log(Selection.active, Selection.active ? Selection.rectangle.toString() : undefined);
            }
            this.originMousePosition = null;
            this.lastMousePosition = null;
        }
    }
}
export class Selection {
    static active = false;
    static rectangle = new Rectangle();
}
