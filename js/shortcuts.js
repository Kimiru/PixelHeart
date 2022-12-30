function shortcut(eventName, ctrl, shift, alt, key) {
    return function (event) {
        if (event.ctrlKey === ctrl && event.shiftKey === shift && event.altKey === alt && event.key === key) {
            event.preventDefault();
            window.dispatchEvent(new Event(eventName));
        }
    };
}
const undo = shortcut('undo', true, false, false, 'z');
const redo = shortcut('redo', true, false, false, 'y');
const cut = shortcut('redo', true, false, false, 'x');
const copy = shortcut('redo', true, false, false, 'c');
const paste = shortcut('redo', true, false, false, 'v');
const selectall = shortcut('redo', true, false, false, 'v');
function addShortCuts() {
    window.addEventListener('keydown', undo);
    window.addEventListener('keydown', redo);
    window.addEventListener('keydown', cut);
    window.addEventListener('keydown', copy);
    window.addEventListener('keydown', paste);
    window.addEventListener('selectall', selectall);
}
function removeShortCuts() {
    window.removeEventListener('keydown', undo);
    window.removeEventListener('keydown', redo);
    window.removeEventListener('keydown', cut);
    window.removeEventListener('keydown', copy);
    window.removeEventListener('keydown', paste);
    window.removeEventListener('selectall', selectall);
    console.log('Removed shortcut');
}
addShortCuts();
window.addEventListener('removeShortcuts', removeShortCuts);
export default removeShortCuts;
