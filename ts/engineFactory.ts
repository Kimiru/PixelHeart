import { GameEngine } from "../2DGameEngine/js/2DGameEngine.js";

const engine = new GameEngine({
    width: innerWidth,
    height: innerHeight,
    verticalPixels: 64 + 6,
    scaling: devicePixelRatio,
    canvas: null,
    images: [],
    sounds: []
})

engine.canvas.style.backgroundColor = '#aaaaaa'

window.addEventListener('resize', () => {
    engine.resize(innerWidth, innerHeight)
})

engine.start()


export default engine