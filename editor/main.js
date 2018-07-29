const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow() {
    console.log('create window')
    mainWindow = new BrowserWindow({width: 1000, height: 800})

    mainWindow.loadURL(`file://${__dirname}/index.html`)

    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function() {
        mainWindow = null
    })

}

// spawn python gym process

let pyProc = null
let pyPort = null

const selectPort = () => {
    pyPort = 4242
    return pyPort
}

const createPyProc = () => {
    let port = '' + selectPort()
    let script = path.join(__dirname, 'gym', 'api.py')
    pyProc = require('child_process').spawn('python', [script, port])
    if (pyProc != null) {
        console.log('child process success')
    }
}

const exitPyProc = () => {
    pyProc.kill()
    pyProc = null
    pyPort = null
}

app.on('ready', function() {
    createWindow()
    createPyProc()
})

app.on('will-quit', function() {
    exitPyProc()
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (mainWindow === null) {
        createWindow()
    }
})