const fs = require('fs')
const { ipcRenderer, contextBridge, dialog } = require('electron')

function toMain(event) {
    window.addEventListener(event, evt => ipcRenderer.send(event, evt.detail))
}

function toRender(event) {
    ipcRenderer.on(event, (evt, data) => window.dispatchEvent(new CustomEvent(event, { detail: data })))
}

document.addEventListener('DOMContentLoaded', () => {

    toMain('Language')
    toMain('requestFilename')
    toRender('receiveFilename')
    toRender('newFile')
    toRender('save')
    toRender('undo')
    toRender('redo')
    toRender('bigger')
    toRender('smaller')

})

window.addEventListener('electron', (event) => {
    // window.dispatchEvent(new Event('removeShortcuts'))
})

contextBridge.exposeInMainWorld('electron', true)