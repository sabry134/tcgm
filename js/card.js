function addCardToMainContent() {
    const mainContent = document.getElementById('main-content');

    if (!mainContent.querySelector('.card')) {
        const newCard = document.createElement('div');
        newCard.classList.add('card');

        newCard.addEventListener('click', () => {
            console.log('Card clicked');
        });

        let isDragging = false;
        let offsetX, offsetY;

        newCard.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - newCard.getBoundingClientRect().left;
            offsetY = e.clientY - newCard.getBoundingClientRect().top;

            newCard.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                let left = e.clientX - offsetX;
                let top = e.clientY - offsetY;

                const mainContentRect = mainContent.getBoundingClientRect();
                const cardRect = newCard.getBoundingClientRect();

                if (left < mainContentRect.left) left = mainContentRect.left;
                if (top < mainContentRect.top) top = mainContentRect.top;
                if (left + cardRect.width > mainContentRect.right) left = mainContentRect.right - cardRect.width;
                if (top + cardRect.height > mainContentRect.bottom) top = mainContentRect.bottom - cardRect.height;

                newCard.style.left = `${left}px`;
                newCard.style.top = `${top}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            newCard.style.cursor = 'pointer';

            const position = {
                x: parseInt(newCard.style.left, 10),
                y: parseInt(newCard.style.top, 10)
            };

            window.electronAPI.savePositionToFile(position, 'card.json');
        });

        newCard.style.position = 'absolute';

        mainContent.appendChild(newCard);
    }
}

window.electronAPI.receive('add-card', addCardToMainContent);
