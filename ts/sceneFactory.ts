import { GameObject, GameScene } from "../2DGameEngine/js/2DGameEngine.js"
import PixelHeartSpriteSheet from "./imaging/PixelHeartSpriteSheet.js"
import ToolManager from "./tooling/ToolManager.js"

let scene = new GameScene()

let pixelHeartSpriteSheet = new PixelHeartSpriteSheet()
globalThis.spriteSheet = pixelHeartSpriteSheet

scene.add(pixelHeartSpriteSheet)
scene.add(new ToolManager())


export default scene