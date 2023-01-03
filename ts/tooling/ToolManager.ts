import { GameObject } from "../../2DGameEngine/js/2DGameEngine.js"
import { CommandFactory } from "../imaging/Commands/Command.js"
import PixelHeartSpriteSheet from "../imaging/PixelHeartSpriteSheet.js"
import tools from "./tools.js"

export default class ToolManager extends GameObject {

    lastTool: string = ''
    lastCursor: string = ''

    #setCursor(type: string, name: string) {

        if (this.lastCursor !== name) {

            this.engine.canvas.style.cursor = type
            this.lastCursor = name

        }

    }

    #updateCursor(dt) {

        let input = this.input

        if (input.mouse.right)
            this.#setCursor('move', 'move')
        else {

            let tool: string = globalThis.vueApp?.tool as string

            if (tool === 'pen')
                this.#setCursor(`url("res/images/Pen_18x18.png") 0 18, default`, 'pen')
            if (tool === 'eraser')
                this.#setCursor(`url("res/images/Eraser_18x18.png") 0 18, default`, 'eraser')
            if (tool === 'line')
                this.#setCursor(`url("res/images/Pen_18x18.png") 0 18, default`, 'line')
            if (tool === 'rectangle')
                this.#setCursor(`url("res/images/Pen_18x18.png") 0 18, default`, 'rectangle')

        }


    }

    update(dt: number): void {

        this.#updateCursor(dt)

        let toolname = globalThis.vueApp?.tool

        let currentTool = tools[toolname]
        let spriteSheet: PixelHeartSpriteSheet = globalThis.spriteSheet

        if (typeof currentTool === 'function' &&
            currentTool?.prototype instanceof CommandFactory)
            currentTool.handle(
                dt,
                [...spriteSheet.sheetContent.size],
                globalThis.vueApp.color
                , this.input)

    }

}