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
                output.textContent = result;
            })
            .catch(error => {
                output.textContent = error;
            });
    } else {
        output.textContent = 'Please enter a command.';
    }
});
