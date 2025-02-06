document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.querySelector('.add-button');
    const saveButton = document.querySelector('.save-button');

    if (addButton) {
        addButton.addEventListener('click', () => {
            window.location.href = 'cardtype.html';
        });
    }

    if (saveButton) {
        saveButton.addEventListener('click', () => {
            console.log('Save button clicked');
            
            const name = document.querySelector('input[name="name"]').value;
            const startingLocation = document.querySelector('input[name="startingLocation"]').value;
            const limitPerDeck = document.querySelector('input[name="limitPerDeck"]').value;
            const limitPerBoard = document.querySelector('input[name="limitPerBoard"]').value;
            const startingDeckType = document.querySelector('input[name="startingDeckType"]').value;
            const power = document.querySelector('input[name="power"]').value;
            const keywords = document.querySelector('input[name="keywords"]').value;
            const parentType = document.querySelector('input[name="parentType"]').value;
            const playRequirementName = document.querySelector('input[name="playRequirementName"]').value;
            const parameters = document.querySelector('input[name="parameters"]').value;

            const generatedJSON = {
                "cards": [
                    {
                        "id": "card_001",
                        "template": "spell",
                        "properties": {
                            "name": name || "Default Name",
                            "cost": limitPerDeck || 2,
                            "text": startingLocation || "Default Location",
                            "effects": [
                                {
                                    "effect": power || "Default Effect"
                                }
                            ]
                        }
                    },
                    {
                        "id": "card_002",
                        "template": "spell.curse",
                        "properties": {
                            "name": startingDeckType || "Default Curse Name",
                            "cost": limitPerBoard || 3,
                            "text": keywords || "Default Keywords",
                            "effects": [
                                {
                                    "effect": parentType || "Default Effect"
                                }
                            ]
                        }
                    }
                ]
            };

            console.log('Generated JSON:', JSON.stringify(generatedJSON, null, 2));

            const jsonBlob = new Blob([JSON.stringify(generatedJSON, null, 2)], { type: 'application/json' });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(jsonBlob);
            link.download = 'cards.json';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log('Download triggered');

            setTimeout(() => {
                window.location.href = 'card.html';
                console.log('Redirecting to card.html');
            }, 500);
        });
    }
});
