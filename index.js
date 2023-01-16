const { app, BrowserWindow, Menu, ipcMain, session, dialog } = require('electron')
const path = require('path')
const { generateMenu } = require('./menu.js')

let window

function createWindow() {

    window = new BrowserWindow({
        icon: './PixelHeart_16x16.png',
        width: 1080,
        height: 700,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false
        }
    })

    // window.maximize()

    window.loadFile('index.html')

    // const menu = generateMenu('en', window)
    // Menu.setApplicationMenu(menu)

    window.removeMenu()
    window.webContents.openDevTools()

    ipcMain.on('requestFilename', (evt, data) => {

        let currentFileName = data.current

        let filename = dialog.showSaveDialogSync(window, {
            defaultPath: currentFileName,
            filters: [{ name: data.ext, extensions: [data.ext] }]
        })

        if (filename) {
            let match = filename.match(`(.*\).${data.ext}$`)
            if (match) filename = match[1]
        }

        window.webContents.send('receiveFilename', { filename })

    })

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

// ipcMain
//     .on('Language', (evt, lang) => {

//         console.log(lang)

//         const menu = generateMenu(lang.language, window)
//         Menu.setApplicationMenu(menu)

//     })


