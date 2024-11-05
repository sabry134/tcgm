const { ipcRenderer } = require('electron');

const cmdInput = document.getElementById('cmdInput');
const executeBtn = document.getElementById('executeBtn');
const output = document.getElementById('output');

executeBtn.addEventListener('click', () => {
    const command = cmdInput.value;
    if (command) {
        output.textContent = 'Executing command...';

        ipcRenderer.invoke('run-command', command)
            .then(result => {
                output.textContent = result;  // Show command result in the output area
            })
            .catch(error => {
                output.textContent = error;  // Show error message if any
            });
    } else {
        output.textContent = 'Please enter a command.';
    }
});
