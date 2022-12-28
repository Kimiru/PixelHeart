import { Vector } from "../../2DGameEngine/js/2DGEMath.js"
import { Camera, GameObject } from "../../2DGameEngine/js/2DGameEngine.js"
import { DrawImageCommand } from "./Commands/DrawImageCommand.js"
import PixelHeartImage from "./PixelHeartImage.js"

type SheetImageEntry = { position: [number, number], image: PixelHeartImage }
type SheetContent = { size: [number, number], images: SheetImageEntry[] }
type SheetExport = { size: [number, number], images: { position: [number, number], base64: string }[] }

export default class PixelHeartSpriteSheet extends GameObject {

    sheetContent: SheetContent = null
    camera: Camera = null
    selectedImage: [number, number]

    #mouseTargetPosition: Vector = null

    constructor(sheetExport: SheetExport = null) {

        super()

        if (sheetExport) this.import(sheetExport)

        else {

            this.selectedImage = [0, 0]

            let sheetImageEntry: SheetImageEntry = {
                position: [0, 0],
                image: new PixelHeartImage(32, 32)
            }

            this.sheetContent = {
                size: [32, 32],
                images: [sheetImageEntry]
            }

        }

        this.bootEvents()


    }

    get currentImage(): PixelHeartImage {

        return this.sheetContent.images.find(image =>
            image.position[0] === this.selectedImage[0] &&
            image.position[1] === this.selectedImage[1]).image

    }

    bootEvents() {

        window.addEventListener('PushCommand', ({ detail: { command } }: CustomEvent) => this.currentImage.pushCommand(command))

        window.addEventListener('Rebuild', _ => this.currentImage.build())

        window.addEventListener('undo', _ => this.currentImage.undo())

        window.addEventListener('redo', _ => this.currentImage.redo())

    }

    import(SheetExport: SheetExport): void {

        this.sheetContent = {
            size: [...SheetExport.size],
            images: []
        }

        for (let entry of SheetExport.images) {

            let sheetImageEntry: SheetImageEntry = {
                position: [...entry.position],
                image: new PixelHeartImage()
            }

            let img = new Image()
            img.onload = _ => {
                sheetImageEntry.image.pushCommand(new DrawImageCommand(img))
            }
            img.src = entry.base64

        }

        let first = this.sheetContent.images.reduce((image, res) => {
            if (image.position[1] < res.position[1]) return image
            if (image.position[1] > res.position[1]) return res
            if (image.position[0] < res.position[0]) return image
            else return res
        })

        this.selectedImage = [...first.position]

    }

    export(): SheetExport {

        let sheetExport: SheetExport = {
            size: [...this.sheetContent.size],
            images: []
        }

        for (let entry of this.sheetContent.images) {

            let image: { position: [number, number], base64: string } = {
                position: [...entry.position],
                base64: entry.image.print()
            }

            sheetExport.images.push(image)

        }

        return sheetExport

    }


    onAdd(): void {

        this.camera = new Camera()

        this.add(this.camera)
        this.scene.camera = this.camera

    }

    resetCamera() {

        this.camera.transform.clear()

        const maxDimension = Math.max(...this.sheetContent.size)
        const zoom = 32 / maxDimension

        this.camera.transform.scale.set(zoom, zoom)

    }

    normalizeImagePositions() {

        let left = Math.min(...this.sheetContent.images.map(img => img.position[0]))
        let top = Math.min(...this.sheetContent.images.map(img => img.position[1]))

        this.selectedImage[0] -= left
        this.selectedImage[1] -= top

        this.sheetContent.images.forEach(image => {
            image.position[0] -= left
            image.position[1] -= top
        })

    }

    #keyboardUpdate(dt: number) {

        let input = this.input

        if (input.isDown('ControlLeft')) {
            if (input.isPressed('ArrowUp'))
                this.camera.transform.scale.multS(1.1 ** -1)
            if (input.isPressed('ArrowDown'))
                this.camera.transform.scale.multS(1.1 ** 1)
        }
        else {
            if (input.isPressed('Space')) {
                this.resetCamera()
            }
            else if (input.isPressed('ArrowLeft')) {
                this.camera.transform.translation.x--
            }
            else if (input.isPressed('ArrowRight')) {
                this.camera.transform.translation.x++
            }
            else if (input.isPressed('ArrowUp')) {
                this.camera.transform.translation.y++
            }
            else if (input.isPressed('ArrowDown')) {
                this.camera.transform.translation.y--
            }
        }

    }

    #mouseUpdate(dt: number) {

        let input = this.input
        let mouse = input.mouse

        if (mouse.right) {

            if (!this.#mouseTargetPosition) this.#mouseTargetPosition = mouse.position.clone()

            let delta: Vector = this.#mouseTargetPosition.clone().sub(mouse.position)

            this.camera.transform.translation.add(delta)

        } else
            this.#mouseTargetPosition = null


        if (mouse.scroll) {

            let scale = 1.1 ** mouse.scroll
            let delta = mouse.position.clone().sub(this.camera.transform.translation)

            this.camera.transform.translation.add(delta)
            this.camera.transform.scale.multS(scale)
            this.camera.transform.translation.sub(delta.multS(scale))

        }

    }

    update(dt: number): void {

        this.#keyboardUpdate(dt)
        this.#mouseUpdate(dt)

        for (let image of this.sheetContent.images)
            image.image.executeUpdate(dt)

    }

    drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {

        ctx.strokeStyle = '#BF9270'
        ctx.lineWidth = .05

        for (let x = 0; x <= width; x++) {
            ctx.beginPath()
            ctx.moveTo(-width / 2 + x, -height / 2)
            ctx.lineTo(-width / 2 + x, height / 2)
            ctx.stroke()
        }

        for (let y = 0; y <= height; y++) {
            ctx.beginPath()
            ctx.moveTo(-width / 2, -height / 2 + y)
            ctx.lineTo(width / 2, -height / 2 + y)
            ctx.stroke()
        }
    }

    draw(ctx: CanvasRenderingContext2D): void {

        const { size: [width, height], images } = this.sheetContent

        let horizontalUnit = width
        let verticalUnit = height

        let horizontalOffset = -this.selectedImage[0] * horizontalUnit
        let verticalOffset = -this.selectedImage[0] * verticalUnit

        for (let image of images) {

            let horizontalPosition = image.position[0] * horizontalUnit + horizontalOffset
            let verticalPosition = image.position[1] * verticalUnit + verticalOffset

            ctx.save()
            ctx.translate(horizontalPosition, verticalPosition)

            let drawRange = new Vector(this.engine.usableWidth, this.engine.usableHeight).length() / 2

            image.image.executeDraw(ctx, drawRange, this.camera.getWorldPosition())

            ctx.restore()

        }

        if (globalThis.vueApp.drawGrid)
            this.drawGrid(ctx, width, height)

    }

}