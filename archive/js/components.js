function loadCardFromLocalStorage() {
      const mainContent = document.getElementById('main-content');
      const cardData = localStorage.getItem('cardPosition');

      if (cardData) {
        const { x, y } = JSON.parse(cardData);

        const newCard = document.createElement('div');
        newCard.classList.add('card');
        newCard.style.left = `${x}px`;
        newCard.style.top = `${y}px`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
        newCard.appendChild(deleteButton);

        let isDragging = false;
        let offsetX, offsetY;

        newCard.addEventListener('mousedown', (e) => {
          e.preventDefault();
          if (e.target !== deleteButton) {
            isDragging = true;
            const cardRect = newCard.getBoundingClientRect();
            offsetX = e.clientX - cardRect.left;
            offsetY = e.clientY - cardRect.top;
            newCard.style.cursor = 'grabbing';
          }
        });

        deleteButton.addEventListener('click', (e) => {
          e.stopPropagation();
          newCard.remove();
          localStorage.removeItem('cardPosition');
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

            newCard.style.left = `${left - mainContentRect.left}px`;
            newCard.style.top = `${top - mainContentRect.top}px`;
          }
        });

        document.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            newCard.style.cursor = 'grab';

            const position = {
              x: parseInt(newCard.style.left, 10),
              y: parseInt(newCard.style.top, 10)
            };

            localStorage.setItem('cardPosition', JSON.stringify(position));
          }
        });

        newCard.style.position = 'absolute';
        mainContent.appendChild(newCard);
      }
    }

    function addCardToMainContent() {
      const mainContent = document.getElementById('main-content');

      const newCard = document.createElement('div');
      newCard.classList.add('card');

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete-button');

      newCard.appendChild(deleteButton);

      let isDragging = false;
      let offsetX, offsetY;

      newCard.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (e.target !== deleteButton) {
          isDragging = true;
          const cardRect = newCard.getBoundingClientRect();
          offsetX = e.clientX - cardRect.left;
          offsetY = e.clientY - cardRect.top;

          newCard.style.cursor = 'grabbing';
        }
      });

      deleteButton.addEventListener('click', (e) => {
        e.stopPropagation();
        newCard.remove();
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

          newCard.style.left = `${left - mainContentRect.left}px`;
          newCard.style.top = `${top - mainContentRect.top}px`;
        }
      });

      document.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          newCard.style.cursor = 'grab';

          const position = {
            x: parseInt(newCard.style.left, 10),
            y: parseInt(newCard.style.top, 10)
          };

          localStorage.setItem('cardPosition', JSON.stringify(position));
        }
      });

      newCard.style.position = 'absolute';
      mainContent.appendChild(newCard);
    }

    function loadButtonFromLocalStorage() {
      const mainContent = document.getElementById('main-content');
      const buttonData = localStorage.getItem('buttonPosition');

      if (buttonData) {
        const { x, y } = JSON.parse(buttonData);

        const newButton = document.createElement('button');
        newButton.classList.add('button');
        newButton.innerText = 'Button';

        const cross = document.createElement('span');
        cross.classList.add('cross');
        cross.innerText = '×';

        newButton.appendChild(cross);

        let isDragging = false;
        let offsetX, offsetY;

        newButton.addEventListener('mousedown', (e) => {
          e.preventDefault();
          isDragging = true;
          const buttonRect = newButton.getBoundingClientRect();
          offsetX = e.clientX - buttonRect.left;
          offsetY = e.clientY - buttonRect.top;

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

            newButton.style.left = `${left - mainContentRect.left}px`;
            newButton.style.top = `${top - mainContentRect.top}px`;
          }
        });

        document.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            newButton.style.cursor = 'pointer';

            const position = {
              x: parseInt(newButton.style.left, 10),
              y: parseInt(newButton.style.top, 10)
            };

            localStorage.setItem('buttonPosition', JSON.stringify(position));
          }
        });

        cross.addEventListener('click', (e) => {
          e.stopPropagation();
          newButton.remove();
          localStorage.removeItem('buttonPosition');
          console.log('Button deleted');
        });

        newButton.style.position = 'absolute';
        newButton.style.left = `${x}px`;
        newButton.style.top = `${y}px`;

        mainContent.appendChild(newButton);
      }
    }

    function addButtonToMainContent() {
      const mainContent = document.getElementById('main-content');

      if (!mainContent.querySelector('.button')) {
        const newButton = document.createElement('button');
        newButton.classList.add('button');
        newButton.innerText = 'Button';

        const cross = document.createElement('span');
        cross.classList.add('cross');
        cross.innerText = '×';

        newButton.appendChild(cross);

        let isDragging = false;
        let offsetX, offsetY;

        newButton.addEventListener('mousedown', (e) => {
          e.preventDefault();
          isDragging = true;
          const buttonRect = newButton.getBoundingClientRect();
          offsetX = e.clientX - buttonRect.left;
          offsetY = e.clientY - buttonRect.top;

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

            newButton.style.left = `${left - mainContentRect.left}px`;
            newButton.style.top = `${top - mainContentRect.top}px`;
          }
        });

        document.addEventListener('mouseup', () => {
          if (isDragging) {
            isDragging = false;
            newButton.style.cursor = 'pointer';

            const position = {
              x: parseInt(newButton.style.left, 10),
              y: parseInt(newButton.style.top, 10)
            };

            localStorage.setItem('buttonPosition', JSON.stringify(position));
          }
        });

        cross.addEventListener('click', (e) => {
          e.stopPropagation();
          newButton.remove();
          localStorage.removeItem('buttonPosition');
          console.log('Button deleted');
        });

        newButton.style.position = 'absolute';

        mainContent.appendChild(newButton);
      }
    }

    window.addEventListener('load', loadButtonFromLocalStorage);


    document.addEventListener('DOMContentLoaded', function() {
    const sceneList = document.getElementById('sceneList');
    const savedScenes = JSON.parse(localStorage.getItem('scenes')) || [];

    savedScenes.forEach(scene => {
        const newScene = document.createElement('li');
        newScene.textContent = scene;
        newScene.onclick = function() {
            highlight(this);
        };
        sceneList.appendChild(newScene);
    });

    restoreHighlight();
});

document.getElementById('addSceneBtn').addEventListener('click', function() {
    const sceneList = document.getElementById('sceneList');
    const newSceneName = `Scene ${sceneList.children.length + 1}`;
    const newScene = document.createElement('li');
    newScene.textContent = newSceneName;
    newScene.onclick = function() {
        highlight(this);
    };
    sceneList.appendChild(newScene);

    const sceneNames = Array.from(sceneList.children).map(scene => scene.textContent);
    localStorage.setItem('scenes', JSON.stringify(sceneNames));
});

document.getElementById('deleteSceneBtn').addEventListener('click', function() {
    const selectedScene = document.querySelector('.scene-inspector li.selected');
    if (selectedScene) {
        const sceneList = document.getElementById('sceneList');
        const sceneName = selectedScene.textContent;

        removeSceneFromStorage(sceneName);
        selectedScene.remove();

        const sceneTitle = document.getElementById('sceneTitle');
        sceneTitle.textContent = '⚙️ Select a Scene';
    }
});

function removeSceneFromStorage(sceneName) {
    let savedScenes = JSON.parse(localStorage.getItem('scenes')) || [];
    savedScenes = savedScenes.filter(scene => scene !== sceneName);
    localStorage.setItem('scenes', JSON.stringify(savedScenes));
}

function highlight(element) {
    const items = document.querySelectorAll('.scene-inspector li');
    items.forEach(item => item.classList.remove('selected'));
    element.classList.add('selected');

    const selectedItemIndex = Array.from(items).indexOf(element);
    localStorage.setItem('selectedItem', selectedItemIndex);

    const sceneTitle = document.getElementById('sceneTitle');
    sceneTitle.textContent = `⚙️ ${element.textContent}`;
}

function restoreHighlight() {
    const items = document.querySelectorAll('.scene-inspector li');
    const selectedItemIndex = localStorage.getItem('selectedItem');

    if (selectedItemIndex !== null) {
        const selectedItem = items[selectedItemIndex];
        selectedItem.classList.add('selected');
        const sceneTitle = document.getElementById('sceneTitle');
        sceneTitle.textContent = `⚙️ ${selectedItem.textContent}`;
    }
}



    window.addEventListener('load', restoreHighlight);


    window.electronAPI.receive('add-card', addCardToMainContent);
    window.electronAPI.receive('add-button', addButtonToMainContent);

    loadCardFromLocalStorage();