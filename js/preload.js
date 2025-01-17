const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)),
    send: (channel, data) => ipcRenderer.send(channel, data),
    savePositionToFile: (position, fileName) => ipcRenderer.invoke('savePositionToFile', position, fileName)
});
