import lang from '../res/json/lang.js'
import tools from './Tools.js'
import { GameEngine, ImageManipulator } from '../2DGameEngine/js/2DGameEngine.js'
import { PixelHeartScene } from './PixelHeart.js'
import ResizeCommand from './Commands/ResizeCommand.js'
import OpenCommand from './Commands/OpenCommand.js'
import { createApp } from '../node_modules/vue/dist/vue.esm-browser.js'

console.log(createApp)

const rem = 16


if ('serviceWorker' in navigator)
    navigator.serviceWorker.register('serviceWorker.js')
        .then((reg) => { console.log('Service worker registered') })
        .catch((err) => { console.log('Service worker did not register', err) })

// Vue.js

function updateColor() {

    let a = Number(vm.alpha).toString(16)
    if (a.length < 2) a = '0' + a

    vm.color = vm.baseColor + a

}

const vm = createApp({

    data() {
        return {
            language: 'en',
            lang,
            tool: tools.pen,
            tools,
            color: '#000000ff',
            baseColor: '#000000',
            alpha: 255,
            engine: null,
            drawBackground: true,
            drawGrid: true,
            currentColors: [],
            savedColors: [],

            displayResize: false,
            nextWidth: 32,
            nextHeight: 32,

            displayFiles: false,
            fileEvent: null,
            currentFilename: '',

            localStorageFiles: JSON.parse(localStorage.getItem('storedImages')) ?? {}
        }
    },
    methods: {
        changeTool: function (tool) {
            document.querySelector('#' + tool + '-tool').checked = true
            vm.tool = tools[tool]
        },
        zoom: function (v) {
            engine.scene.getTags('image')[0].zoom(v)
        },
        undo: function () {
            engine.scene.getTags('image')[0].undo()
        },
        redo: function () {
            engine.scene.getTags('image')[0].redo()
        },
        setSize: function (width, height) {

            vm.imageSize.width = width
            vm.imageSize.height = height

            let obj = engine.scene.getTags('image')[0]

            obj.logLayers()
            obj.updateImageSizes()

        },
        toggleGrid: function () {

            console.log(this.drawGrid)

        },
        saveColor: function () {

            this.savedColors.push(this.color)

        },
        setColor: function (color) {

            this.baseColor = color.slice(0, 7)

            let alphaStr = color.slice(7)
            let alpha = parseInt(alphaStr, 16)

            this.alpha = alpha

        },
        removeColor: function (index) {

            this.savedColors = this.savedColors.filter((_, i) => i != index)

        },
        download: function () {

            let name = prompt(lang.givename[this.language], vm.currentFilename)
            if (name === null) return
            if (name === '') name = 'PixelHeart'

            engine.scene.getTags('image')[0].image.merge().download(name)

        },
        resize: function () {

            let command = new ResizeCommand(this.nextWidth, this.nextHeight)
            let image = engine.scene.getTags('image')[0].image
            image.addCommand(command)

        },
        fileChange: function (e) {

            let image = new Image()
            image.onload = () => {

                let imageManipulator = new ImageManipulator(image.width, image.height)
                imageManipulator.ctx.drawImage(image, 0, 0)


                let command = new OpenCommand(imageManipulator)
                image = engine.scene.getTags('image')[0].image
                image.addCommand(command)

                this.displayFiles = false

            }
            image.src = URL.createObjectURL(e.target.files[0])
            let filename = /(.*)\..+$/.exec(e.target.files[0].name)

            vm.currentFilename = filename[1]

        },

        saveCanvasIntoLocalStorage() {

            let filename = document.querySelector('#inputFileName').value

            if (filename === '') {
                alert(lang.localStorage.noname[vm.language])
                return
            }
            if (vm.localStorageFiles[filename] && !confirm(lang.localStorage.already[vm.language])) return

            let base64 = engine.scene.getTags('image')[0].image.merge().print()

            vm.localStorageFiles[filename] = base64

            localStorage.setItem('storedImages', JSON.stringify(vm.localStorageFiles))

        },

        useStoredImage(key) {

            let source = new Image()
            source.onload = () => {

                let image = engine.scene.getTags('image')[0]

                let imageManipulator = new ImageManipulator(source.width, source.height)

                imageManipulator.ctx.drawImage(source, 0, 0)
                let command = new OpenCommand(imageManipulator)
                image = engine.scene.getTags('image')[0].image
                image.addCommand(command)

                vm.displayFiles = false
                vm.currentFilename = key
            }
            source.src = vm.localStorageFiles[key]

        },

        deleteStoredImage(key) {

            if (confirm(lang.localStorage.confirmDelete[vm.language])) {

                delete vm.localStorageFiles[key]

                localStorage.setItem('storedImages', JSON.stringify(vm.localStorageFiles))

            }

        },
        downloadStoredImage(key) {

            let source = new Image()
            source.onload = () => {

                let imageManipulator = new ImageManipulator(source.width, source.height)
                imageManipulator.ctx.drawImage(source, 0, 0)
                imageManipulator.download(key)

            }
            source.src = vm.localStorageFiles[key]

        },

        fliph: function () { engine.scene.getTags('image')[0].fliph() },
        flipv: function () { engine.scene.getTags('image')[0].flipv() }

    },
    watch: {

        baseColor: updateColor,
        alpha: updateColor,
        color: function () {

            document.querySelector('#colorPreviewPatch').style.backgroundColor = vm.color

        }
    }

}).mount('#app')

window.vm = vm

document.querySelector('#colorPreviewPatch').style.backgroundColor = vm.color


// Engine

function minDimension() {
    return Math.min(innerWidth - 30 * rem, innerHeight) * .9
}


let engine = new GameEngine({
    width: minDimension(),
    height: minDimension(),
    verticalPixels: 64
})
vm.engine = engine

engine.setScene(new PixelHeartScene(vm))

engine.start()

window.addEventListener('resize', () => {
    engine.resize(minDimension(), minDimension())
})

window.addEventListener('beforeunload', () => {

    let image = engine.scene.getTags('image')[0].image

    let im = image.merge()

    localStorage.setItem('previousWork', im.print())
    localStorage.setItem('language', vm.language)
    localStorage.setItem('savedColors', JSON.stringify(vm.savedColors))

})

document.querySelector('#canvas').replaceWith(engine.canvas)

let language = localStorage.getItem('language')
if (language) vm.language = language

let savedColors = localStorage.getItem('savedColors')
if (savedColors) {
    vm.savedColors = JSON.parse(savedColors)
}

let source = localStorage.getItem('previousWork')
if (source) {

    let image = new Image()
    image.onload = () => {

        let imageManipulator = new ImageManipulator(image.width, image.height)

        if (imageManipulator.print() !== source)

            if (confirm(lang.restore[vm.language])) {

                imageManipulator.ctx.drawImage(image, 0, 0)
                let command = new OpenCommand(imageManipulator)
                image = engine.scene.getTags('image')[0].image
                image.addCommand(command)

            }
    }
    image.src = source

}

