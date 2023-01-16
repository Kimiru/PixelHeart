import { createApp } from '../node_modules/vue/dist/vue.esm-browser.prod.js'
import engine from './engineFactory.js'
import tools from './tooling/tools.js'
import lang from '../res/json/lang.js'
import scene from './sceneFactory.js'
import './shortcuts.js'
import PixelHeartSpriteSheet, { SheetExport } from './imaging/PixelHeartSpriteSheet.js'
import { openFile, saveFile, saveFileAs } from './fileManager.js'

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
        currentFileName: '',
        currentSaveType: 'png',
        displayFileNamePicker: false,
        filenameCallback: null,
        filenamePromise: null

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

            openFile()

        },

        async exportFile() {

            if (this.filenameCallback) {
                this.filenameCallback?.(undefined)
                await this.filenamePromise
            }

            this.displayFileNamePicker = true

            this.filenamePromise = new Promise((ok) => {

                this.filenameCallback = ok

            })
                .then((filename: string) => {

                    if (filename === undefined || filename === '') throw 'Canceled'

                    let link = document.querySelector('download') as HTMLAnchorElement

                    let data = `data:text/json;charset=utf-8,` + encodeURIComponent(JSON.stringify((globalThis.spriteSheet as PixelHeartSpriteSheet).export()))

                    console.log(data)

                    link.href = data
                    link.download = filename + '.json'
                    link.click()

                    console.log(filename)

                })
                .catch(() => { })
                .finally(() => {
                    this.displayFileNamePicker = false
                    this.filenamePromise = null
                })

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

window.addEventListener('open', () => {

    document.getElementById('fileinput').click()

})

window.addEventListener('save', () => {
    if (!globalThis.electron || vueApp.currentFileName === '')
        return window.dispatchEvent(new Event('saveas'))

    vueApp.currentSaveType = 'png'
    saveFile((globalThis.spriteSheet as PixelHeartSpriteSheet).exportImage())
})

window.addEventListener('saveas', () => {
    vueApp.currentSaveType = 'png'
    saveFileAs((globalThis.spriteSheet as PixelHeartSpriteSheet).exportImage())
})

window.addEventListener('export', () => {
    if (!globalThis.electron || vueApp.currentFileName === '')
        return window.dispatchEvent(new Event('exportas'))

    vueApp.currentSaveType = 'json'
    saveFile((globalThis.spriteSheet as PixelHeartSpriteSheet).exportAsString())
})

window.addEventListener('exportas', () => {
    vueApp.currentSaveType = 'json'
    saveFileAs((globalThis.spriteSheet as PixelHeartSpriteSheet).exportAsString())
})
