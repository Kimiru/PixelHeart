import { EraserCommandFactory } from "../imaging/Commands/EraserCommand.js";
import { PenCommandFactory } from "../imaging/Commands/PenCommand.js";
let index = 0;
export default {
    pen: PenCommandFactory,
    line: index++,
    rectangle: index++,
    select: index++,
    move: index++,
    eraser: EraserCommandFactory,
    picker: index++,
    bucket: index++,
    magic_bucket: index++
};
