function addButtonToMainContent() {
    const mainContent = document.getElementById('main-content');

    if (!mainContent.querySelector('.button')) {
        const newButton = document.createElement('button');
        newButton.classList.add('button');
        newButton.innerText = 'Button';
        mainContent.appendChild(newButton);
    }
}

window.electronAPI.receive('add-button', addButtonToMainContent);

console.log('component.js loaded');
