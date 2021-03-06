function mockHTMLEvent (type) {
    var e = document.createEvent('HTMLEvents')
    e.initEvent(type, true, true)
    return e
}

function mockKeyEvent (type) {
    var e = document.createEvent('KeyboardEvent'),
        initMethod = e.initKeyboardEvent
            ? 'initKeyboardEvent'
            : 'initKeyEvent'
    e[initMethod](type, true, true, null, false, false, false, false, 9, 0)
    return e
}

function mockMouseEvent (type) {
    var e = document.createEvent('MouseEvent')
    e.initMouseEvent(type, true, true, null, 1, 0, 0, 0, 0, false, false, false, false, 0, null)
    return e
}