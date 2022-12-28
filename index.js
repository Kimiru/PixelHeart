const { app, BrowserWindow, Menu, ipcRenderer, ipcMain } = require('electron')
const path = require('path')
const { generateMenu } = require('./menu.js')

let window

function createWindow() {

    window = new BrowserWindow({
        width: 1080,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        }
    })

    // window.maximize()

    window.loadFile('index.html')

    const menu = generateMenu('en', window)
    Menu.setApplicationMenu(menu)

}

app.whenReady().then(() => {

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })

})

ipcMain
    .on('Language', (evt, lang) => {

        console.log(lang)

        const menu = generateMenu(lang.language, window)
        Menu.setApplicationMenu(menu)

    })
