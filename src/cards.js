const fs = require('fs');

const generateCards = (inputs) => {
    return {
        "cards": [
            {
                "id": "card_001",
                "template": "spell",
                "properties": {
                    "name": inputs.spellName || "Fireball",
                    "cost": inputs.spellCost || 2,
                    "text": inputs.spellText || "Deals 2 damage to any target.",
                    "effects": [
                        {
                            "effect": inputs.spellEffect || "effect_001"
                        }
                    ]
                }
            },
            {
                "id": "card_002",
                "template": "spell.curse",
                "properties": {
                    "name": inputs.curseName || "Drain",
                    "cost": inputs.curseCost || 3,
                    "text": inputs.curseText || "Drains 1 mana from target familiar on linger.",
                    "effects": [
                        {
                            "effect": inputs.curseEffect || "effect_002"
                        }
                    ]
                }
            }
        ]
    };
};

const userInput = {
    spellName: "Flame Strike",
    spellCost: 4,
    spellText: "Deals 4 damage to all enemies.",
    spellEffect: "effect_003",
    curseName: "Hex",
    curseCost: 5,
    curseText: "Weakens target's defense on linger.",
    curseEffect: "effect_004"
};

const generatedCards = generateCards(userInput);

fs.writeFileSync('cards.json', JSON.stringify(generatedCards, null, 2), 'utf-8');

console.log('Cards saved to cards.json');
