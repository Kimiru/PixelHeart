import { ColorPickerCommandFactory } from "../imaging/Commands/ColorPickerCommand.js";
import { EraserCommandFactory } from "../imaging/Commands/EraserCommand.js";
import { LineCommandFactory } from "../imaging/Commands/LineCommand.js";
import { PenCommandFactory } from "../imaging/Commands/PenCommand.js";
import { RectangleCommandFactory } from "../imaging/Commands/RectangleCommand.js";
import { SelectionCommandFactory } from "../imaging/Commands/SelectionCommand.js";
let index = 0;
export default {
    pen: PenCommandFactory,
    line: LineCommandFactory,
    rectangle: RectangleCommandFactory,
    select: SelectionCommandFactory,
    move: index++,
    eraser: EraserCommandFactory,
    picker: ColorPickerCommandFactory,
    bucket: index++,
    magic_bucket: index++
};
