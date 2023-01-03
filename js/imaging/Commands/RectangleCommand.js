import { Vector } from "../../../2DGameEngine/js/2DGEMath.js";
import { Command, CommandFactory } from "./Command.js";
export class RectangleCommand extends Command {
    v0;
    v1;
    color;
    constructor(v0, v1, color) {
        super();
        this.v0 = v0;
        this.v1 = v1;
        this.color = color;
    }
    plotLine(ctx, v0, v1, color) {
        let x0 = v0.x;
        let y0 = v0.y;
        let x1 = v1.x;
        let y1 = v1.y;
        let dx = Math.abs(x1 - x0);
        let sx = x0 < x1 ? 1 : -1;
        let dy = -Math.abs(y1 - y0);
        let sy = y0 < y1 ? 1 : -1;
        let error = dx + dy;
        ctx.fillStyle = color;
        while (true) {
            // TODO
            // if (!SelectCommand.selectionRectangle || SelectCommand.selectionRectangle.contains(new Vector(x0, y0)))
            ctx.fillRect(x0, y0, 1, 1);
            if (x0 === x1 && y0 === y1)
                break;
            let e2 = 2 * error;
            if (e2 >= dy) {
                if (x0 == x1)
                    break;
                error += dy;
                x0 += sx;
            }
            if (e2 <= dx) {
                if (y0 == y1)
                    break;
                error += dx;
                y0 += sy;
            }
        }
    }
    plotRect(ctx, v0, v1, color) {
        let v01 = new Vector(v0.x, v1.y);
        let v10 = new Vector(v1.x, v0.y);
        this.plotLine(ctx, v0, v01, color);
        this.plotLine(ctx, v0, v10, color);
        this.plotLine(ctx, v1, v01, color);
        this.plotLine(ctx, v1, v10, color);
    }
    draw(ctx) {
        this.plotRect(ctx, this.v0, this.v1, this.color);
    }
}
export class RectangleCommandFactory extends CommandFactory {
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
                this.commandInBaking = new RectangleCommand(position.clone(), position.clone(), color);
                CommandFactory.pushCommand(this.commandInBaking);
            }
            if (!this.lastMousePosition || !this.lastMousePosition.equal(position)) {
                this.commandInBaking.v1.copy(position);
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
