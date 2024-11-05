local Card = {}
Card.__index = Card
local Effect = require("effects.effect")

function Card:new(name, effects, types, limit_per_deck, limit_per_board, play_requirements, custom_values, keywords)
    local card = setmetatable({}, Card)

    card.name = name
    card.effects = {}

    if effects then
        for _, effect in ipairs(effects) do
            if getmetatable(effect) ~= Effect then
                error("Invalid effect: expected an instance of Effect, got " .. type(effect))
            end
            table.insert(card.effects, effect) -- Only add valid effects
        end
    end

    card.types = types or {}
    card.limit_per_deck = limit_per_deck
    card.limit_per_board = limit_per_board
    card.play_requirements = play_requirements or {}
    card.custom_values = custom_values or {}
    card.keywords = keywords or {}

    return card
end

function Card:printCard()
    print("Card name: " .. (self.name or "N/A"))

    print("Effects:")
    for _, effect in ipairs(self.effects) do
        effect:printEffect()
    end

    print("Types:")
    for _, type in ipairs(self.types) do
        print("  - " .. type)
    end

    print("Limit per Deck: " .. (self.limit_per_deck or "N/A"))
    print("Limit per Board: " .. (self.limit_per_board or "N/A"))

    print("Play requirement:")
    for _, play_requirement in ipairs(self.play_requirements) do
        print("  * Play requirement Name: " .. play_requirement.name)
        print("  * Play requirement parameters:")
        for key, value in pairs(play_requirement.parameters) do
            print("    * " .. key .. ": " .. tostring(value))
        end
    end

    print("Custom Values:")
    for key, value in pairs(self.custom_values) do
        print("  " .. key .. ": " .. tostring(value))
    end

    print("Keywords:")
    for i, keyword in ipairs(self.keywords) do
        print("  - " .. keyword)
    end
end

return Card
