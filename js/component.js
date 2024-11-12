const { exec } = require('child_process');

function addButtonToMainContent() {
    const mainContent = document.getElementById('main-content');

    if (!mainContent.querySelector('.button')) {
        const newButton = document.createElement('button');
        newButton.classList.add('button');
        newButton.innerText = 'Button';
        mainContent.appendChild(newButton);
    }
}

function buildProject() {
    const winCommand = 'love .\\src'

    // Execute a command on Windows (replace with your specific command)
    exec(winCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}

// window.electronAPI.receive('add-button', addButtonToMainContent); // window.electronAPI is not defined

console.log('component.js loaded');

module.exports = {
    buildProject
};
