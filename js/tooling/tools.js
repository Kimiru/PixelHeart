import { EraserCommandFactory } from "../imaging/Commands/EraserCommand.js";
import { LineCommandFactory } from "../imaging/Commands/LineCommand.js";
import { PenCommandFactory } from "../imaging/Commands/PenCommand.js";
import { RectangleCommandFactory } from "../imaging/Commands/RectangleCommand.js";
let index = 0;
export default {
    pen: PenCommandFactory,
    line: LineCommandFactory,
    rectangle: RectangleCommandFactory,
    select: index++,
    move: index++,
    eraser: EraserCommandFactory,
    picker: index++,
    bucket: index++,
    magic_bucket: index++
};
