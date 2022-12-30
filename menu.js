const { ipcMain, Menu, app } = require('electron')
let lang = require('./res/json/lang.json')


function generateMenu(language = 'en', window) {

    const send = (event, ...args) => {
        window.webContents.send(event, ...args)
    }

    const template = [
        {
            label: lang.menu.file[language],
            submenu: [
                { label: lang.menu.new[language], click() { send('newFile') } },
                { type: 'separator' },
                { label: lang.menu.save[language], accelerator: 'CommandOrControl+S', click() { send('save') } },
                { label: lang.menu.saveas[language], accelerator: 'CommandOrControl+Shift+S', click() { send('saveas') } },
                { type: 'separator' },
                { label: lang.menu.quit[language], role: 'quit' }
            ]
        },
        {
            label: lang.menu.edit[language],
            submenu: [
                { label: lang.menu.undo[language], accelerator: 'CommandOrControl+Z', click() { send('undo') } },
                { label: lang.menu.redo[language], accelerator: 'CommandOrControl+Y', click() { send('redo') } },
                { type: 'separator' },
                { label: lang.menu.cut[language], accelerator: 'CommandOrControl+X', click() { send('cut') } },
                { label: lang.menu.copy[language], accelerator: 'CommandOrControl+C', click() { send('copy') } },
                { label: lang.menu.paste[language], accelerator: 'CommandOrControl+V', click() { send('paste') } },
                { type: 'separator' },
                { label: lang.menu.selectall[language], accelerator: 'CommandOrControl+A', click() { send('selectall') } },
            ]
        },
        {
            label: 'Other',
            submenu: [
                { role: 'reload' },
                { role: 'toggleDevTools' }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(template)

    return menu

}

module.exports = { generateMenu }