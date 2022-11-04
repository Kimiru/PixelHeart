import { Camera, GameObject, GameScene, ImageManipulator, range, Vector } from "../2DGameEngine/js/2DGameEngine.js";
import tools from "./Tools.js";

class PixelHeartImage extends GameObject {

    layers = []
    selectedLayer = 0
    vm

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

            layer.setSize(this.vm.imageSize.width, this.vm.imageSize.height)

        }

    }

    mouseToCanvas(position) {

        position = position.clone()

        position.y *= -1
        position.addS(this.vm.imageSize.width / 2, this.vm.imageSize.height / 2)
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

        if (!this.undoStack.length) return

        this.redoStack.push(this.layers)
        this.layers = this.undoStack.pop()

        this.vm.imageSize.width = this.layers[0].width
        this.vm.imageSize.height = this.layers[0].height

    }

    redo() {

        if (!this.redoStack.length) return

        this.undoStack.push(this.layers)
        this.layers = this.redoStack.pop()

        this.vm.imageSize.width = this.layers[0].width
        this.vm.imageSize.height = this.layers[0].height

    }

    zoom(value = 1) {

        let scale = Math.min(1, this.scene.camera.transform.scale.x * (1 - value * .1))

        this.scene.camera.transform.scale.set(scale, scale)

    }

    keyEvent() {

        let input = this.engine.input

        if (input.isDown('ControlLeft')) {
            if (input.isCharPressed('z')) this.undo()
            else if (input.isCharPressed('y')) this.redo()
            else if (input.isPressed('ArrowUp')) this.zoom(1)
            else if (input.isPressed('ArrowDown')) this.zoom(-1)
        }

        else if (input.isCharPressed('p')) this.vm.changeTool('pen')
        else if (input.isCharPressed('e')) this.vm.changeTool('eraser')
        else if (input.isCharPressed('l')) this.vm.changeTool('line')
        else if (input.isCharPressed('r')) this.vm.changeTool('rectangle')
        else if (input.isCharPressed('m')) this.vm.changeTool('move')
        else if (input.isCharPressed('s')) this.vm.changeTool('select')
        else if (input.isPressed('ArrowLeft')) this.scene.camera.transform.translation.x--
        else if (input.isPressed('ArrowRight')) this.scene.camera.transform.translation.x++
        else if (input.isPressed('ArrowUp')) this.scene.camera.transform.translation.y++
        else if (input.isPressed('ArrowDown')) this.scene.camera.transform.translation.y--

    }

    pen() {

        let input = this.engine.input
        let mouse = input.mouse
        let position = this.mouseToCanvas(mouse.position)
        let layer = this.layers[this.selectedLayer]

        if (mouse.left)
            this.logLayers(() => {
                if (!position.equal(this.lastPosition)) {
                    layer.setPixel(position.x, position.y, this.vm.color)
                    this.lastPosition.copy(position)
                }
            })
        else
            this.lastPosition.set(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)

    }

    eraser() {

        let input = this.engine.input
        let mouse = input.mouse
        let position = this.mouseToCanvas(mouse.position)
        let layer = this.layers[this.selectedLayer]

        if (mouse.left)
            this.logLayers(() => {
                layer.setPixelRGBA(position.x, position.y, 0, 0, 0, 0)
            })
        else this.lastPosition.set(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)

    }

    line() {

        let input = this.engine.input
        let mouse = input.mouse
        let position = this.mouseToCanvas(mouse.position)
        let layer = this.layers[this.selectedLayer]

        if (mouse.left) {
            if (this.lastPosition.equalS(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
                this.lastPosition.copy(position)

        }
        else {
            if (!this.lastPosition.equalS(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER))
                this.logLayers(() => {
                    this.plotLine(layer.ctx, this.lastPosition, position, this.vm.color)
                })

            this.lastPosition.set(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER)
        }
    }

    update(dt) {

        this.transform.scale.set(vm.imageSize.width, vm.imageSize.height)

        this.keyEvent()

        if (this.vm.tool === tools.pen) this.pen()
        else if (this.vm.tool === tools.eraser) this.eraser()
        else if (this.vm.tool === tools.line) this.line()

        else { }

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

    draw(ctx) {

        ctx.fillStyle = 'lightgray'
        ctx.fillRect(-.5, -.5, 1, 1)
        ctx.fillStyle = 'gray'

        let scale = new Vector(this.vm.imageSize.width, this.vm.imageSize.height)

        let size = new Vector(.5, .5).div(scale)

        for (let x = 0; x < scale.x * 2; x++)
            for (let y = 0; y < scale.y * 2; y++) {
                if ((x & 1) ^ (y & 1)) {
                    ctx.fillRect(-.5 + x * size.x, -.5 + y * size.y, size.x, size.y)
                }
            }

        ctx.stokeStyle = 'black'
        ctx.lineWidth = .003
        for (let index = 1; index < scale.y; index++) {
            ctx.beginPath()
            ctx.moveTo(-.5, -.5 + index * 2 * size.y)
            ctx.lineTo(.5, -.5 + index * 2 * size.y)
            // ctx.moveTo(index * size.y, -.5)
            // ctx.lineTo(index * size.y, .5)
            ctx.stroke()

        }
        for (let index = 1; index < scale.x; index++) {
            ctx.beginPath()
            ctx.moveTo(-.5 + index * 2 * size.x, -.5)
            ctx.lineTo(-.5 + index * 2 * size.x, .5)
            ctx.stroke()

        }

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

                        ctx.save()
                        // ctx.scale(1 / this.vm.imageSize.width, -1 / this.vm.imageSize.height)
                        // ctx.translate(-this.vm.imageSize.width / 2, - this.vm.imageSize.height / 2)

                        im.executeDraw(ctx)

                        ctx.restore()
                    }

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