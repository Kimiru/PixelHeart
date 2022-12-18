import { createApp } from '../node_modules/vue/dist/vue.esm-browser.js';
import engine from './engineFactory.js';
import lang from '../res/json/lang.js';
import tools from './tools.js';
if ('serviceWorker' in navigator)
    navigator.serviceWorker.register('serviceWorker.js')
        .then((reg) => { console.log('Service worker registered'); })
        .catch((err) => { console.log('Service worker did not register', err); });
function updateColor() {
    let a = Number(vueApp.alpha).toString(16);
    if (a.length < 2)
        a = '0' + a;
    vueApp.color = vueApp.baseColor + a;
}
function appData() {
    return {
        lang,
        language: 'en',
        tools,
        tool: 'pen',
        baseColor: '#000000',
        alpha: 255,
        color: '#000000ff'
    };
}
const vueApp = createApp({
    data: appData,
    methods: {
        changeTool(tool) {
            document.querySelector('#' + tool + '-tool').checked = true;
            this.tool = this.tools[tool];
        }
    },
    watch: {
        baseColor: updateColor,
        alpha: updateColor,
    }
}).mount('#app');
document.querySelector('#canvas').replaceWith(engine.canvas);
let language = localStorage.getItem('language');
if (language)
    vueApp.language = language;
