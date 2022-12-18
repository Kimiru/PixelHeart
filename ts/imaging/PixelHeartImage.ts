import { GameObject, ImageManipulator } from "../../2DGameEngine/js/2DGameEngine.js";
import { Command } from "./Commands/Command.js";

export default class PixelHeartImage extends ImageManipulator {

    commands: Command[] = []

    undo(): void {

    }

    redo(): void {
    }

    apply(command: Command): void {

    }

}