export function openFile() {
    let input = document.getElementById('fileinput');
    let file = input.files[0];
    let filename = file.name;
    let ext = file.name.split('.').pop();
    console.log(filename, ext);
    if (ext === 'json') {
        let filereader = new FileReader();
        filereader.onload = (event) => {
            let data = JSON.parse(event.target.result.toString());
            if (!data.size || !Array.isArray(data.size) || data.size.length === 2)
                return console.error('missing field "size" a tuple [number, number]');
            if (!data.images || !Array.isArray(data.images) || data.images.length === 0)
                return console.error('missing field "images" an array of {position: [number, number], base64: string} with at least one image');
            for (let index in data.images) {
                let image = data.images[index];
                if (!image.position || !Array.isArray(image.position) || data.position.length === 2)
                    return console.error(`missing field "position" a tuple [number, number] inside images[${index}]`);
                if (!image.base64 || typeof image.base64 !== 'string')
                    return console.error(`missing field "base64" a string inside images[${index}]`);
            }
            globalThis.spriteSheet.import(data);
            this.currentFileName = filename;
        };
        filereader.readAsText(file);
    }
    else {
        let image = new Image();
        image.onload = () => {
            globalThis.spriteSheet.importImage(image);
        };
        image.src = URL.createObjectURL(file);
    }
}
export async function saveFile(data) {
    console.log('saveFile');
    console.log(data);
    if (globalThis.electron) {
        let currentFileName = globalThis.vueApp.currentFileName;
        console.log(currentFileName);
    }
    else {
        let link = document.getElementById('download');
        link.href = data;
        link.download = globalThis.vueApp.currentFileName + (globalThis.vueApp.currentSaveType === 'png' ? '.png' : '.json');
        link.click();
    }
}
export async function saveFileAs(data) {
    console.log('saveFileAs');
    let vueApp = globalThis.vueApp;
    if (globalThis.electron) {
        let receive;
        new Promise((ok) => {
            receive = (event) => {
                ok(event.detail.filename);
            };
            window.addEventListener('receiveFilename', receive);
            window.dispatchEvent(new CustomEvent('requestFilename', { detail: { current: vueApp.currentFileName, ext: vueApp.currentSaveType } }));
        }).then(filename => {
            if (!filename)
                return;
            vueApp.currentFileName = filename;
            saveFile(data);
        }).finally(() => {
            window.removeEventListener('receiveFilename', receive);
        });
    }
    else {
        let filename = prompt(vueApp.lang.givename[vueApp.language], vueApp.currentFileName);
        if (!filename)
            return;
        vueApp.currentFileName = filename;
        saveFile(data);
    }
}
