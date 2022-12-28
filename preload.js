const fs = require('fs')
const { ipcRenderer } = require('electron')

function toMain(event) {
    window.addEventListener(event, evt => ipcRenderer.send(event, evt.detail))
}

function toRender(event) {
    ipcRenderer.on(event, (evt, data) => window.dispatchEvent(new CustomEvent(event, { detail: data })))
}

document.addEventListener('DOMContentLoaded', () => {

    toMain('Language')
    toRender('newFile')
    toRender('save')
    toRender('undo')
    toRender('redo')

})

