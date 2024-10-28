const fs = require('fs');

const generateTemplate = (inputs) => {
    return {
        "templates": {
            [`familiar ${inputs.type}`]: {
                "properties": {
                    "name": inputs.familiarName || "string",
                    "description": "string",
                    "innate": "string",
                    "cost": inputs.familiarCost || "number",
                    "mana": inputs.familiarMana || "number",
                    "growth": inputs.familiarGrowth || "number",
                    "health": inputs.familiarHealth || "number",
                    "text": inputs.familiarText || "string",
                    "effects": [
                        {
                            "effect": "string",
                            "conditions": [
                                {
                                    "condition": "string"
                                }
                            ]
                        }
                    ]
                }
            },
            "spell": {
                "properties": {
                    "name": "string",
                    "cost": "string",
                    "text": "string",
                    "effects": [
                        {
                            "effect": "string",
                            "conditions": [
                                {
                                    "condition": "string"
                                }
                            ]
                        }
                    ]
                },
                "subtypes": [
                    {
                        "type": "curse",
                        "properties": {
                            "linger": inputs.curseLinger || "number"
                        }
                    }
                ]
            }
        }
    };
};

const userInput = {
    type: "dragon",
    familiarName: "Flame Drake",
    familiarCost: 5,
    familiarMana: 3,
    familiarGrowth: 2,
    familiarHealth: 7,
    familiarText: "Breathes fire upon enemies.",
    curseLinger: 3
};

const generatedTemplate = generateTemplate(userInput);

fs.writeFileSync('card.json', JSON.stringify(generatedTemplate, null, 2), 'utf-8');

console.log('Template saved to card.json');
