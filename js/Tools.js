import BucketCommand from "./Commands/BucketCommand.js";
import ColorPickerCommand from "./Commands/ColorPickerCommand.js";
import EraserCommand from "./Commands/EraserCommand.js";
import LineCommand from "./Commands/LineCommand.js";
import MagicWandCommand from "./Commands/MagicWandCommand.js";
import MoveCommand from "./Commands/MoveCommand.js";
import PenCommand from "./Commands/PenCommand.js";
import RectangleCommand from "./Commands/RectangleCommand.js";
import SelectCommand from "./Commands/SelectCommand.js";

export default {

    pen: PenCommand,
    line: LineCommand,
    rectangle: RectangleCommand,
    select: SelectCommand,
    move: MoveCommand,
    eraser: EraserCommand,
    picker: ColorPickerCommand,
    bucket: BucketCommand,
    magic_bucket: MagicWandCommand

}