const { app, BrowserWindow, Menu } = require('electron');

function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    win.loadFile('./src/index.html');

    const menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [{ role: 'quit' }],
        },
        {
            label: 'Edit',
            submenu: [{ role: 'undo' }, { role: 'redo' }],
        },
        {
            label: 'Assets',
            submenu: [],
        },
        {
            label: 'GameObject',
            submenu: [],
        },
        {
            label: 'Component',
            submenu: [
                {
                    label: 'Button',
                    click: () => {
                        win.webContents.send('add-button');
                    },
                },
                { label: 'Card', click: () => { console.log('Card clicked'); } },
                { label: 'Figure', click: () => { console.log('Figure clicked'); } },
            ],
        },
        {
            label: 'Windows',
            submenu: [],
        },
        {
            label: 'Help',
            submenu: [],
        },
    ]);

    Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
