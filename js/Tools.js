import EraserCommand from "./Commands/EraserCommand.js";
import LineCommand from "./Commands/LineCommand.js";
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
    picker: 6,
    bucket: 7,
    magic_bucket: 8

}