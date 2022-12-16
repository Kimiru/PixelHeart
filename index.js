const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')

function createWindow() {

    const window = new BrowserWindow({
        width: 1080,
        height: 800,
        webPreferences: {
            preload: path.resolve('preload.js')
        }
    })

    window.maximize()

    window.loadFile('index.html')

    console.log('window created')

}

app.whenReady().then(() => {

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') app.quit()
    })

    const template = [
        {
            label: "File",
            submenu: [
                {
                    label: 'exit',
                    role: 'quit'
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

})