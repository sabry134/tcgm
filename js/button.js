function addButtonToMainContent() {
    const mainContent = document.getElementById('main-content');

    if (!mainContent.querySelector('.button')) {
        const newButton = document.createElement('button');
        newButton.classList.add('button');
        newButton.innerText = 'Button';

        newButton.addEventListener('dblclick', (e) => {
            e.stopPropagation();

            const confirmDelete = confirm('Are you sure you want to delete this button?');
            if (confirmDelete) {
                newButton.remove();
                console.log('Button deleted');
            } else {
                console.log('Button not deleted');
            }
        });

        let isDragging = false;
        let offsetX, offsetY;

        newButton.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - newButton.getBoundingClientRect().left;
            offsetY = e.clientY - newButton.getBoundingClientRect().top;

            newButton.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let left = e.clientX - offsetX;
                let top = e.clientY - offsetY;

                const mainContentRect = mainContent.getBoundingClientRect();
                const buttonRect = newButton.getBoundingClientRect();

                if (left < mainContentRect.left) left = mainContentRect.left;
                if (top < mainContentRect.top) top = mainContentRect.top;
                if (left + buttonRect.width > mainContentRect.right) left = mainContentRect.right - buttonRect.width;
                if (top + buttonRect.height > mainContentRect.bottom) top = mainContentRect.bottom - buttonRect.height;

                newButton.style.left = `${left}px`;
                newButton.style.top = `${top}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            newButton.style.cursor = 'pointer';

            const position = {
                x: parseInt(newButton.style.left, 10),
                y: parseInt(newButton.style.top, 10)
            };

            window.electronAPI.savePositionToFile(position, 'button.json');
        });

        newButton.style.position = 'absolute';

        mainContent.appendChild(newButton);
    }
}

window.electronAPI.receive('add-button', addButtonToMainContent);
