import { DrawImageCommand } from "./imaging/Commands/DrawImageCommand.js"
import PixelHeartSpriteSheet from "./imaging/PixelHeartSpriteSheet.js"

export function openFile() {

    let input: HTMLInputElement = document.getElementById('fileinput') as HTMLInputElement

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

        let image = new Image()

        image.onload = () => {

            (globalThis.spriteSheet as PixelHeartSpriteSheet).importImage(image)

        }

        image.src = URL.createObjectURL(file)

    }

}

export async function saveFile(data: string) {

    console.log('saveFile')

    console.log(data)

    if (globalThis.electron) {

        let currentFileName = globalThis.vueApp.currentFileName
        console.log(currentFileName)

    } else {

        let link = document.getElementById('download') as HTMLAnchorElement
        link.href = data
        link.download = globalThis.vueApp.currentFileName + (globalThis.vueApp.currentSaveType === 'png' ? '.png' : '.json')
        link.click()

    }

}

export async function saveFileAs(data: string) {

    console.log('saveFileAs')

    let vueApp = globalThis.vueApp

    if (globalThis.electron) {

        let receive: (event: CustomEvent<{ filename: string }>) => void

        new Promise((ok: (string: string) => void) => {

            receive = (event: CustomEvent<{ filename: string }>) => {

                ok(event.detail.filename)

            }

            window.addEventListener('receiveFilename', receive)

            window.dispatchEvent(new CustomEvent(
                'requestFilename',
                { detail: { current: vueApp.currentFileName, ext: vueApp.currentSaveType } }
            ))

        }).then(filename => {

            if (!filename) return

            vueApp.currentFileName = filename
            saveFile(data)


        }).finally(() => {

            window.removeEventListener('receiveFilename', receive)

        })


    } else {

        let filename = prompt(vueApp.lang.givename[vueApp.language], vueApp.currentFileName)

        if (!filename) return

        vueApp.currentFileName = filename

        saveFile(data)

    }

}