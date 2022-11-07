import lang from '../res/json/lang.js'
import tools from './Tools.js'
import { GameEngine, range } from '../2DGameEngine/js/2DGameEngine.js'
import { PixelHeartScene } from './PixelHeart.js'

const rem = 16

// Vue.js

function updateColor() {

    let a = Number(vm.alpha).toString(16)
    if (a.length < 2) a = '0' + a

    vm.color = vm.baseColor + a

}

const vm = Vue.createApp({

    data() {
        return {
            language: 'en',
            lang,
            tool: tools.pen,
            tools,
            imageSize: { width: 32, height: 32 },
            color: '#000000ff',
            baseColor: '#000000',
            alpha: 255,
            engine: null,
            drawBackground: true,
            drawGrid: true,
            currentColors: [],
            savedColors: []
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

        }

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
    return Math.min(innerWidth - 20 * rem, innerHeight) * .8
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

document.querySelector('#canvas').replaceWith(engine.canvas)
