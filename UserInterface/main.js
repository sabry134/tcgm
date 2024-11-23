const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');  // Node.js child_process to run cmd commands
const os = require('os');  // Required to detect the operating system

let win;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,  // Allows us to use Node.js in the renderer process
            contextIsolation: false // Required for nodeIntegration to work
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

// Listen for the "run-command" event from renderer process
ipcMain.handle('run-command', (event, command) => {
    return new Promise((resolve, reject) => {
        let shellCommand;

        if (os.platform() === 'win32') {
            // Windows uses cmd.exe
            shellCommand = `cmd.exe /c ${command}`;
        } else if (os.platform() === 'linux' || os.platform() === 'darwin') {
            // Linux and macOS use bash or sh
            shellCommand = `sh -c "${command}"`;
        } else {
            reject('Unsupported OS');
            return;
        }

        // Execute the shell command
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
