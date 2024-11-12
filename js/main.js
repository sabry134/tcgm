const path = require('path');
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const fs = require('fs');

function createWindow() {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        }
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
            label: 'Setting',
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
                { 
                    label: 'Card', 
                    click: () => { 
                        win.webContents.send('add-card');
                    } 
                },
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
        {
            label: 'Sabry',
            click: () => {
                win.webContents.openDevTools();
            },
        },
    ]);

    Menu.setApplicationMenu(menu);
}

ipcMain.handle('savePositionToFile', (event, position, fileName) => {
    console.log(fileName);
    const finalFileName = fileName || 'button.json';
    const filePath = path.join(__dirname, finalFileName);

    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(position, null, 2), 'utf8');
    console.log(`Position saved to ${finalFileName}:`, position);
});





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
