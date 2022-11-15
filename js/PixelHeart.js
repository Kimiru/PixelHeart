import { Camera, GameObject, GameScene, ImageManipulator, range, Rectangle, Vector } from "../2DGameEngine/js/2DGameEngine.js";
import MoveCommand from "./Commands/MoveCommand.js";
import SelectCommand from "./Commands/SelectCommand.js";
import PixelImage from "./PixelImage.js";
import tools from "./Tools.js";

class PixelHeartImage extends GameObject {

    image = new PixelImage()

    layers = []
    selectedLayer = 0
    vm
    selectedArea = null
    movingLayer = null
    lastTool = null

    undoStack = []
    redoStack = []
    lastPosition = new Vector(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)

    constructor(vm) {

        super()

        this.addTag('image')

        this.vm = vm

        this.newLayer()

        this.logLayers()

    }

    newLayer() {

        this.layers.push(new ImageManipulator())
        this.updateImageSizes()

    }

    updateImageSizes() {

        for (let layer of this.layers) {

            layer.setSize(this.image.width, this.image.height)

        }

    }

    mouseToCanvas(position) {

        position = position.clone()

        position.y *= -1
        position.addS(this.image.width / 2, this.image.height / 2)
        position.floor()

        return position

    }

    cmpLayers(l1, l2) {

        if (l1.length !== l2.length) return true
        else for (let index = 0; index < l1.length; index++)
            if (l1[index].print() !== l2[index].print())
                return true

    }

    logLayers(func = () => { }) {

        let mem = this.layers.map(layer => layer.clone())
        func()
        let current = this.layers

        if (this.cmpLayers(mem, current)) {
            this.undoStack.push(mem)
            this.redoStack = []

        }

    }

    undo() {

        this.image.undo()

    }

    redo() {

        this.image.redo()

    }

    zoom(value = 1) {

        let scale = Math.min(10, this.scene.camera.transform.scale.x * (1 - value * .1))

        this.scene.camera.transform.scale.set(scale, scale)

    }

    keyEvent() {

        let input = this.engine.input

        if (input.isDown('ControlLeft')) {
            if (input.isCharPressed('z')) this.undo()
            else if (input.isCharPressed('y')) this.redo()
            else if (input.isPressed('ArrowUp')) this.zoom(1)
            else if (input.isPressed('ArrowDown')) this.zoom(-1)
            else if (input.isCharPressed('c')) MoveCommand.copy(this.image)
            else if (input.isCharPressed('v')) {
                MoveCommand.paste(this.image)
                this.vm.changeTool('move')
            }
        }

        else if (input.isCharPressed('R')) this.vm.displayResize = true

        // Change tools
        else if (input.isCharPressed('p')) this.vm.changeTool('pen')
        else if (input.isCharPressed('e')) this.vm.changeTool('eraser')
        else if (input.isCharPressed('l')) this.vm.changeTool('line')
        else if (input.isCharPressed('r')) this.vm.changeTool('rectangle')
        else if (input.isCharPressed('m')) this.vm.changeTool('move')
        else if (input.isCharPressed('s')) this.vm.changeTool('select')
        else if (input.isCharPressed('k')) this.vm.changeTool('picker')
        else if (input.isCharPressed('a')) {

            let w = this.image.width
            let h = this.image.height
            let x = w / 2 - .5
            let y = h / 2 - .5

            SelectCommand.selectionRectangle = new Rectangle(x, y, w, h)

            this.vm.changeTool('select')

        }
        else if (input.isCharPressed('b')) this.vm.changeTool('bucket')
        else if (input.isCharPressed('w')) this.vm.changeTool('magic_bucket')

        else if (this.vm.tool === MoveCommand) {
            if (input.isPressed('Enter')) {
                this.vm.changeTool('select')
                SelectCommand.selectionRectangle = null
            }
        }

        else if (SelectCommand.selectionRectangle) {

            if (input.isCharPressed('f')) {


                let source = SelectCommand.selectionRectangle.clone()
                source.transform.translation.addS(.5, .5)
                let imageManipulator = new ImageManipulator(source.w, source.h)

                imageManipulator.ctx.fillStyle = this.vm.color
                imageManipulator.ctx.fillRect(0, 0, source.w, source.h)
                let offset = new Vector(0, 0)

                let command = new MoveCommand(imageManipulator, source, offset, this.image.activeCalcNumber)
                this.image.addCommand(command)

            }
            if (input.isPressed('Delete')) {

                let imageManipulator = new ImageManipulator(1, 1)

                let source = SelectCommand.selectionRectangle.clone()
                source.transform.translation.addS(.5, .5)
                let offset = new Vector(0, 0)

                let command = new MoveCommand(imageManipulator, source, offset, this.image.activeCalcNumber)
                this.image.addCommand(command)

                SelectCommand.selectionRectangle = null
                if (this.vm.tool === tools.move)
                    this.vm.changeTool('select')

            }

        }


        this.move()

    }

    move() {
        let input = this.engine.input

        if (this.vm.displayResize || this.vm.displayFiles) return

        if (input.isPressed('ArrowLeft')) {
            this.scene.camera.transform.translation.x--
        }
        else if (input.isPressed('ArrowRight')) {
            this.scene.camera.transform.translation.x++
        }
        else if (input.isPressed('ArrowUp')) {
            this.scene.camera.transform.translation.y++
        }
        else if (input.isPressed('ArrowDown')) {
            this.scene.camera.transform.translation.y--
        }


    }

    isTool(tool) { return this.vm.tool === tool }

    update(dt) {

        let input = this.engine.input
        let mouse = input.mouse
        let position = this.mouseToCanvas(mouse.position)

        this.transform.scale.set(this.image.width, this.image.height)


        if (this.lastTool !== this.vm.tool) {

            if (typeof this.lastTool === 'function') this.lastTool.endOfUse(this.image)
            if (typeof this.vm.tool === 'function') this.vm.tool.startOfUse(this.image)

            this.lastTool = this.vm.tool
        }


        if (typeof this.vm.tool === 'function') {

            let command = this.vm.tool.use(input, position, mouse.left, this.vm.color, this.image)

            if (command) (this.image.addCommand(command))

        }

        if (typeof this.vm.tool !== 'function' || !this.vm.tool.hasCommandInBaking() || this.vm.tool === MoveCommand)
            this.keyEvent()


    }

    plotLine(ctx, v0, v1, color) {

        let x0 = v0.x
        let y0 = v0.y
        let x1 = v1.x
        let y1 = v1.y

        let dx = Math.abs(x1 - x0)
        let sx = x0 < x1 ? 1 : -1
        let dy = -Math.abs(y1 - y0)
        let sy = y0 < y1 ? 1 : -1

        let error = dx + dy

        ctx.fillStyle = color

        while (true) {


            if (!this.selectedArea || this.selectedArea.contains(new Vector(x0, y0)))
                ctx.fillRect(x0, y0, 1, 1)
            if (x0 === x1 && y0 === y1) break
            let e2 = 2 * error
            if (e2 >= dy) {
                if (x0 == x1) break
                error += dy
                x0 += sx
            }
            if (e2 <= dx) {
                if (y0 == y1) break
                error += dx
                y0 += sy
            }
        }
    }

    plotRect(ctx, v0, v1, color) {

        let v01 = new Vector(v0.x, v1.y)
        let v10 = new Vector(v1.x, v0.y)

        this.plotLine(ctx, v0, v01, color)
        this.plotLine(ctx, v0, v10, color)
        this.plotLine(ctx, v1, v01, color)
        this.plotLine(ctx, v1, v10, color)

    }

    // GLOBAL DRAW FUNCTIONS

    /**
     * Display the color gray background used to discern used alpha colors
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawGrayBackground(ctx) {

        ctx.fillStyle = 'lightgray'
        ctx.fillRect(-.5, -.5, 1, 1)
        ctx.fillStyle = 'gray'

        let width = this.image.width
        let height = this.image.height

        // .5 / value ==> 4square per pixel
        let squaresWidth = .5 / width
        let squaresHeight = .5 / height

        for (let x = 0; x < width * 2; x++) for (let y = 0; y < height * 2; y++)
            if ((x & 1) ^ (y & 1))
                ctx.fillRect(
                    -.5 + x * squaresWidth,
                    -.5 + y * squaresHeight,
                    squaresWidth,
                    squaresHeight
                )

    }

    /**
     * Display the black grid in front of the image to discern individual pixels when drawing large bodies of color
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    drawBlackGrid(ctx) {

        ctx.stokeStyle = 'black'
        ctx.lineWidth = .003

        let width = this.image.width
        let height = this.image.height

        let pixelsWidth = 1 / width
        let pixelsHeight = 1 / height

        for (let index = 1; index < height; index++) {
            ctx.beginPath()
            ctx.moveTo(-.5, -.5 + index * pixelsHeight)
            ctx.lineTo(.5, -.5 + index * pixelsHeight)
            ctx.stroke()

        }
        for (let index = 1; index < width; index++) {
            ctx.beginPath()
            ctx.moveTo(-.5 + index * pixelsWidth, -.5)
            ctx.lineTo(-.5 + index * pixelsWidth, .5)
            ctx.stroke()

        }

    }

    draw(ctx) {

        if (this.vm.drawBackground)
            this.drawGrayBackground(ctx)

        this.image.draw(ctx, this.vm.tool)

        if (this.vm.drawGrid)
            this.drawBlackGrid(ctx)

        if (SelectCommand.selectionRectangle)
            SelectCommand.drawSelectionRectangle(ctx, this.image)

        if (false)
            for (let [index, layer] of Object.entries(this.layers)) {

                layer.executeDraw(ctx)

                if (Number(index) === this.selectedLayer) {
                    let input = this.engine.input
                    let mouse = input.mouse
                    let position = this.mouseToCanvas(mouse.position)


                    if (this.vm.tool === tools.line) {
                        if (mouse.left) {
                            let im = new ImageManipulator(this.vm.imageSize.width, this.vm.imageSize.height)
                            this.plotLine(im.ctx, this.lastPosition, position, this.vm.color)
                            im.executeDraw(ctx)
                        }
                    }
                    else if (this.vm.tool === tools.rectangle) {
                        if (mouse.left) {
                            let im = new ImageManipulator(this.vm.imageSize.width, this.vm.imageSize.height)
                            this.plotRect(im.ctx, this.lastPosition, position, this.vm.color)
                            im.executeDraw(ctx)
                        }
                    }
                    else if (this.vm.tool === tools.select) {
                        if (mouse.left) {

                            let delta = position.clone().sub(this.lastPosition).abs().addS(1, 1)
                            let middleman = this.lastPosition.clone().add(position).divS(2).subS(this.vm.imageSize.width / 2, this.vm.imageSize.height / 2)
                            let rect = new Rectangle(middleman.x, middleman.y, delta.x, delta.y)

                            ctx.save()
                            ctx.scale(1 / this.vm.imageSize.width, -1 / this.vm.imageSize.height)
                            ctx.lineWidth = .2
                            ctx.strokeStyle = 'blue'
                            ctx.strokeRect(rect.left + .5, rect.bottom + .5, rect.w, rect.h)
                            ctx.restore()
                        }
                    }

                    if (this.selectedArea) {

                        ctx.save()
                        ctx.scale(1 / this.vm.imageSize.width, -1 / this.vm.imageSize.height)
                        ctx.lineWidth = .2
                        ctx.strokeStyle = 'blue'
                        ctx.strokeRect(
                            this.selectedArea.left - this.vm.imageSize.width / 2 + .5,
                            this.selectedArea.bottom - this.vm.imageSize.height / 2 + .5,
                            this.selectedArea.w, this.selectedArea.h)
                        ctx.restore()

                    }
                    if (this.movingLayer) {
                        ctx.save()
                        ctx.translate(size.x * 2 * this.movingLayer.transform.translation.x, -size.y * 2 * this.movingLayer.transform.translation.y)
                        this.movingLayer.draw(ctx)
                        ctx.restore()
                    }
                }

            }

    }

}

export class PixelHeartScene extends GameScene {

    pixelHeartImage

    constructor(vm) {

        super()

        this.camera = new Camera()

        this.pixelHeartImage = new PixelHeartImage(vm)

        this.add(this.pixelHeartImage)

    }

}