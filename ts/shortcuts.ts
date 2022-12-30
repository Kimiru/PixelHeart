function shortcut(eventName: string, ctrl: boolean, shift: boolean, alt: boolean, key: string) {

    return function (event: KeyboardEvent) {

        if (event.ctrlKey === ctrl && event.shiftKey === shift && event.altKey === alt && event.key === key) {

            event.preventDefault()

            window.dispatchEvent(new Event(eventName))

        }

    }


}

const save = shortcut('save', true, false, false, 'z')
const saveas = shortcut('saveas', true, false, false, 'z')

const undo = shortcut('undo', true, false, false, 'z')
const redo = shortcut('redo', true, false, false, 'y')
const cut = shortcut('cut', true, false, false, 'x')
const copy = shortcut('copy', true, false, false, 'c')
const paste = shortcut('paste', true, false, false, 'v')
const selectall = shortcut('selectall', true, false, false, 'v')

function addShortCuts() {

    window.addEventListener('keydown', save)
    window.addEventListener('keydown', saveas)

    window.addEventListener('keydown', undo)
    window.addEventListener('keydown', redo)
    window.addEventListener('keydown', cut)
    window.addEventListener('keydown', copy)
    window.addEventListener('keydown', paste)
    window.addEventListener('keydown', selectall)

}

function removeShortCuts() {

    window.removeEventListener('keydown', save)
    window.removeEventListener('keydown', saveas)

    window.removeEventListener('keydown', undo)
    window.removeEventListener('keydown', redo)
    window.removeEventListener('keydown', cut)
    window.removeEventListener('keydown', copy)
    window.removeEventListener('keydown', paste)
    window.removeEventListener('keydown', selectall)

    console.log('Removed shortcut')

}

addShortCuts()
window.addEventListener('removeShortcuts', removeShortCuts)

export default removeShortCuts
