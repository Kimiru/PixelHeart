import { createApp } from '../node_modules/vue/dist/vue.esm-browser.prod.js'
import engine from './engineFactory.js'
import tools from './tooling/tools.js'
import lang from '../res/json/lang.js'
import scene from './sceneFactory.js'

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
        lang,
        language: 'en',

        tools,
        tool: 'pen',

        baseColor: '#000000',
        alpha: 255,
        color: '#000000ff',

        drawBackground: true,
        drawGrid: true,

    }
}

const vueApp = createApp({

    data: appData,

    methods: {

        setLanguage(language: string) {

            localStorage.setItem('language', language)

            this.language = language
            let event = new CustomEvent('Language', { detail: { language } })

            window.dispatchEvent(event)

        },

        setTool(tool) {
            this.tool = tool
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
if (language) setTimeout(() => { vueApp.setLanguage(language) })
