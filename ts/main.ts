import { createApp } from '../node_modules/vue/dist/vue.esm-browser.prod.js'
import engine from './engineFactory.js'
import tools from './tooling/tools.js'
import lang from '../res/json/lang.js'
import scene from './sceneFactory.js'
import './shortcuts.js'
import PixelHeartSpriteSheet, { SheetExport } from './imaging/PixelHeartSpriteSheet.js'

if ('serviceWorker' in navigator)
    navigator.serviceWorker.register('serviceWorker.js')
        .then((reg) => { console.log('Service worker registered') })
        .catch((err) => { console.log('Service worker did not register', err) })

function updateColor() {

    let a = Number(vueApp.alpha).toString(16)
    if (a.length < 2) a = '0' + a

    vueApp.color = vueApp.baseColor + a

}

function appData() {
    return {
        langImages: {
            fr: 'res/images/French_flag_3x2.png',
            en: 'res/images/UK_flag_55x33.png',
            tokipona: 'res/images/tokipona_flag_39x26.png'
        },
        lang,
        language: 'en',

        tools,
        tool: 'pen',

        baseColor: '#000000',
        alpha: 255,
        color: '#000000ff',

        drawBackground: true,
        drawGrid: true,


        interfaceScale: 1,
        currentFileName: ''

    }
}

const vueApp = createApp({

    data: appData,

    methods: {

        setLanguage(language: string) {

            document.getElementById('flagMenu').classList.remove('active')

            localStorage.setItem('language', language)

            this.language = language
            let event = new CustomEvent('Language', { detail: { language } })

            window.dispatchEvent(event)

        },

        setTool(tool) {
            this.tool = tool
        },

        setScale(scale) {
            vueApp.interfaceScale = scale
            localStorage.setItem('scale', scale)
        },

        openFile(event: Event) {
            let input: HTMLInputElement = event.target as HTMLInputElement

            let file = input.files[0]
            let filename = file.name
            let ext = file.name.split('.').pop()

            console.log(filename, ext)

            if (ext === 'json') {

                let filereader = new FileReader()
                filereader.onload = (event: ProgressEvent<FileReader>) => {

                    let data = JSON.parse(event.target.result.toString())

                    if (!data.size || !Array.isArray(data.size) || data.size.length === 2) return console.error('missing field "size" a tuple [number, number]')
                    if (!data.images || !Array.isArray(data.images) || data.images.length === 0) return console.error('missing field "images" an array of {position: [number, number], base64: string} with at least one image')

                    for (let index in data.images) {
                        let image = data.images[index]
                        if (!image.position || !Array.isArray(image.position) || data.position.length === 2) return console.error(`missing field "position" a tuple [number, number] inside images[${index}]`)
                        if (!image.base64 || typeof image.base64 !== 'string') return console.error(`missing field "base64" a string inside images[${index}]`)
                    }

                    (globalThis.spriteSheet as PixelHeartSpriteSheet).import(data)

                    this.currentFileName = filename

                }
                filereader.readAsText(file)

            } else {



            }

        },

        exportFile() {

            let filename = prompt(lang.givename[this.language], this.currentFileName)

            if (!filename || filename === '') return

            this.currentFileName = filename

            console.log(filename)


        }

    },

    watch: {
        baseColor: updateColor,
        alpha: updateColor,
    }

}).mount('#app')

globalThis.vueApp = vueApp

document.querySelector('#canvas')?.replaceWith(engine.canvas)
engine.setScene(scene)

let language = localStorage.getItem('language')
if (language) setTimeout(() => vueApp.setLanguage(language))
let scale = localStorage.getItem('scale')
if (scale) setTimeout(() => vueApp.setScale(Number(scale)))

window.dispatchEvent(new Event('electron'))

window.addEventListener('bigger', () => vueApp.setScale(Math.min(vueApp.interfaceScale + .2,)))
window.addEventListener('smaller', () => vueApp.setScale(Math.max(1, vueApp.interfaceScale - .2)))