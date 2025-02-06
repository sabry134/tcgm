const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process'); 
const os = require('os');

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.handle('run-command', (event, command) => {
    return new Promise((resolve, reject) => {
        let shellCommand;

        if (os.platform() === 'win32') {
            shellCommand = `cmd.exe /c ${command}`;
        } else if (os.platform() === 'linux' || os.platform() === 'darwin') {
            shellCommand = `sh -c "${command}"`;
        } else {
            reject('Unsupported OS');
            return;
        }

        exec(shellCommand, (error, stdout, stderr) => {
            if (error) {
                reject(`Error: ${error.message}`);
            } else if (stderr) {
                reject(`stderr: ${stderr}`);
            } else {
                resolve(stdout);
            }
        });
    });
});
