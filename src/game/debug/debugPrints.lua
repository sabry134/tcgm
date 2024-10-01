local cardsModule = require("cards.cards")

local Prints = {}

-- Function to print effects
function Prints.PrintEffects(effects)
    for key, effect in pairs(effects) do
        print("Effect ID: " .. key)
        print("  Action: " .. effect.action)

        -- Print parameters
        print("  Parameters:")
        for param, value in pairs(effect.parameters) do
            print("    " .. param .. ": " .. tostring(value))
        end
        print()  -- Add an empty line for better readability
    end
end

-- Function to print card type templates
function Prints.PrintProcessedTemplates(processedTemplates)
    print("=== Processed Templates ===")
    for templateName, template in pairs(processedTemplates) do
        print("Template: " .. templateName)
        print("  Properties:")
        for propName, propType in pairs(template.properties) do
            if propName ~= "effects" then
                print("    " .. propName .. ": " .. tostring(propType))
            end
        end
        -- Handle effects separately
        if template.properties.effects then
            print("  Effects:")
            for _, effectObj in ipairs(template.properties.effects) do
                print("    Effect: " .. effectObj.effect)
                if effectObj.conditions and #effectObj.conditions > 0 then
                    print("      Conditions:")
                    for _, conditionObj in ipairs(effectObj.conditions) do
                        print("        - " .. conditionObj.condition)
                    end
                end
            end
        end
        print("---------------------------")
    end
end

-- Function to print card properties
local function printCardProperties(card, processedTemplates)
    print("=== Card Properties ===")
    print("Card ID: " .. card.id)
    print("Template: " .. card.template)

    -- Get merged properties
    local props = cardsModule.GetCardProperties(card, processedTemplates)

    print("  Properties:")
    for propName, propValue in pairs(props) do
        if propName ~= "effects" then
            print("    " .. propName .. ": " .. tostring(propValue))
        end
    end

    -- Handle effects
    if props.effects and #props.effects > 0 then
        print("  Effects:")
        for _, effectObj in ipairs(props.effects) do
            print("    Effect: " .. effectObj.effect)
            if effectObj.conditions and #effectObj.conditions > 0 then
                print("      Conditions:")
                for _, conditionObj in ipairs(effectObj.conditions) do
                    print("        - " .. conditionObj.condition)
                end
            end
        end
    end
    print("-------------------------")
end

-- Function to print all properties of all cards
function Prints.PrintAllCardProperties(cards, processedTemplates)
    for _, card in ipairs(cards) do
        printCardProperties(card, processedTemplates)
    end
end

-- Function to print properties of a specific card by ID
function Prints.PrintCardById(cardId, cards, processedTemplates)
    for _, card in ipairs(cards) do
        if card.id == cardId then
            printCardProperties(card, processedTemplates)
            return
        end
    end
    print("Card with ID '" .. cardId .. "' not found.")
end

return Prints
