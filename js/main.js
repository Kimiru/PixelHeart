import lang from '../res/json/lang.js'
import tools from './Tools.js'
import { GameEngine } from '../2DGameEngine/js/2DGameEngine.js'
import { PixelHeartScene } from './PixelHeart.js'

const rem = 16

// Vue.js

const vm = Vue.createApp({

    data() {
        return {
            language: 'en',
            lang,
            tool: tools.pen,
            tools,
            imageSize: { width: 32, height: 32 },
            color: 'black',
            engine: null,
            drawGrid: true,
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

        }
    }

}).mount('#app')

window.vm = vm

// Engine

function minDimension() {
    return Math.min(innerWidth - 10 * rem, innerHeight) * .8
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
