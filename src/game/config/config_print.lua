
local ConfigPrint = {}

function ConfigPrint:printCardConfig(card)
    print("Card name: " .. (card.name or "N/A"))

    print("Effects:")
    for i, effect in ipairs(card.effects) do
        -- Accessing specific fields from the effect table
        print("  - Effect Name: " .. effect.name)
        
        print("    Requirements:")
        for _, requirement in ipairs(effect.requirements) do
            print("      * " .. requirement.name .. " (params: " .. tostring(requirement.parameters) .. ")")
        end

        print("    Actions:")
        for _, action in ipairs(effect.actions) do
            print("      * Action Name: " .. action.name .. " (params: " .. tostring(action.parameters) .. ")")
        end

        print("    Speed: " .. effect.speed)
        print("    Description: " .. (effect.description or "N/A"))
        print("    Usage Limit: " .. (effect.usage_limit and effect.usage_limit.type .. " (" .. effect.usage_limit.value .. ")" or "N/A"))
    end

    print("Types:")
    for i, type in ipairs(card.types) do
        print("  - " .. type)
    end

    print("Limit per Deck: " .. (card.limit_per_deck or "N/A"))
    print("Limit per Board: " .. (card.limit_per_board or "N/A"))

    print("Play Requirements:")
    for _, req in ipairs(card.play_requirements) do
        print("  * " .. req.name .. " (params: " .. tostring(req.parameters) .. ")")
    end

    print("Custom Values:")
    for key, value in pairs(card.custom_values) do
        print("  " .. key .. ": " .. tostring(value))
    end

    print("Keywords:")
    for i, keyword in ipairs(card.keywords) do
        print("  - " .. keyword)
    end
end

--function ConfigPrint:printCardConfigs(cards)
--    for _, card in ipairs(card)
--end

return ConfigPrint
