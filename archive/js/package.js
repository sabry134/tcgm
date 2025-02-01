const { exec } = require('child_process');

function packageToLove2D() {
    console.log("Packaging the app...");
    const winCommand = "love .\\src";
    const unixCommand = "love ./src";
    const command = process.platform === "win32" ? winCommand : unixCommand;

    console.log("Packaging the app...");

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        console.log(`stdout: ${stdout}`);
        console.error(`stderr: ${stderr}`);
    });
}

window.electronAPI.receive('package-app', packageToLove2D);
