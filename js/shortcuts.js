function shortcut(eventName, ctrl, shift, alt, key) {
    return function (event) {
        if (event.ctrlKey === ctrl && event.shiftKey === shift && event.altKey === alt && event.key === key) {
            event.preventDefault();
            window.dispatchEvent(new Event(eventName));
        }
    };
}
const shortcuts = {
    save: shortcut('save', true, false, false, 's'),
    saveas: shortcut('saveas', true, true, false, 'S'),
    export: shortcut('export', true, false, false, 'e'),
    exportas: shortcut('exportas', true, true, false, 'E'),
    open: shortcut('open', true, false, false, 'o'),
    undo: shortcut('undo', true, false, false, 'z'),
    redo: shortcut('redo', true, false, false, 'y'),
    cut: shortcut('cut', true, false, false, 'x'),
    copy: shortcut('copy', true, false, false, 'c'),
    paste: shortcut('paste', true, false, false, 'v'),
    selectall: shortcut('selectall', true, false, false, 'v'),
};
function addShortCuts() {
    for (let [name, shortcut] of Object.entries(shortcuts))
        window.addEventListener('keydown', shortcut);
}
function removeShortCuts() {
    for (let [name, shortcut] of Object.entries(shortcuts))
        window.removeEventListener('keydown', shortcut);
    console.log('Removed shortcut');
}
addShortCuts();
window.addEventListener('removeShortcuts', removeShortCuts);
export default removeShortCuts;
