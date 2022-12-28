import { GameEngine, GameObject, GameScene } from "../2DGameEngine/js/2DGameEngine.js"
import scene from "./sceneFactory.js"

let verticalPixels = 32 + 16

function resizeEngine() {

    if (innerHeight < innerWidth)
        engine.resize(innerWidth, innerHeight, devicePixelRatio, verticalPixels)
    else {

        const ratio = innerHeight / innerWidth
        const adaptedVerticalPixels = verticalPixels * ratio

        engine.resize(innerWidth, innerHeight, devicePixelRatio, adaptedVerticalPixels)

    }

}

const engine = new GameEngine({
    width: innerWidth,
    height: innerHeight,
    verticalPixels: 64 + 6,
    scaling: devicePixelRatio,
    canvas: null,
    images: [{ name: 'pen', src: 'res/images/Pen_18x18.png' }],
    sounds: []
})

engine.canvas.style.backgroundColor = '#00000000'

window.addEventListener('resize', resizeEngine)
resizeEngine()

engine.setScene(scene)

engine.start()

export default engine