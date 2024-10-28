
local ConfigPrint = {}

function ConfigPrint:printCardConfig(card)
    print("Card name: " .. (card.name or "N/A"))

    print("Effects:")
    for i, effect in ipairs(self.effects) do
        print("  - " .. effect)
    end

    print("Types:")
    for i, type in ipairs(self.types) do
        print("  - " .. type)
    end

    print("Limit per Deck: " .. (self.limit_per_deck or "N/A"))
    print("limit per Board: " .. (self.limit_per_board or "N/A"))

    print("Play Requirements:")
    for key, value in pairs(self.play_requirements) do
        print("  " .. key .. ": " .. tostring(value))
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

return ConfigPrint
