const electron = require('electron')
const ipcMain = electron.ipcMain
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const __DEV__ = process.env.NODE_ENV === 'development'

console.log('alive')

let windowsRegistry = []

function createWindow (opt = {})
{
    let options = Object.assign(
        {
            width: 800,
            height: 500,
            nodeIntegration: false,
            webViewTag: false
        }, opt
    )

    let mainWindow = new BrowserWindow(options)
    windowsRegistry.push(mainWindow)

    console.log('createWindow', opt)

    // let wurl = 'file://${__dirname}/index.html'
    let wurl = 'https://localhost:4000'
    mainWindow.loadURL(wurl)

    // if (__DEV__)
    // {
        // mainWindow.webContents.openDevTools()
    // }

    mainWindow.on('close', (event) => {
        const win = event.sender
        const index = windowsRegistry.indexOf(win)
        console.log('Windows on close', index)
        const contents = win.webContents

        if (contents != null)
        {
            win.destroy
        }
    })

    mainWindow.on('closed', (event) => {
        const index = windowsRegistry.indexOf(event.sender)
        console.log('Window closed idx:%d', index)
        windowsRegistry.splice(index, 1)
    })

    return mainWindow
}

app.on('ready', e => 
{
    // asynchronous
    ipcMain.on('asynchronous-message', (event, arg) =>
    {
        console.log(arg)
        event.sender.send('asynchronous-reply', 'pong')
    })
    //synchronous
    ipcMain.on('winman', (event, arg) =>
    {
        console.log('ipcMain.on winman', arg)
        event.returnValue = 'pong'
    })

    let win = createWindow()

    win.webContents.on('did-finish-load', function()
    {
        // win.webContents.send('args-obj', program)
    });
})

app.on('window-all-closed', function()
{
    console.log('window-all-closed')
    if (process.platform !== 'darwin') 
    {
        app.quit()
    }
})

app.on('activate', function () 
{
    if (windowsRegistry.length === 0) {
        createWindow()
    }
})
