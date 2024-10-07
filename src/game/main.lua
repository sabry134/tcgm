local debugPrints = require("debug.debugPrints")
local cardsModule = require("cards.cards")
local loading = require("load")
local processTemplates = require("processTemplates")

function love.load()
    love.graphics.setBackgroundColor(1, 1, 1)  -- White background

    local processedTemplates = loading.LoadTemplates()
    local cards = loading.LoadCards()
    local effects = loading.LoadEffects()

    debugPrints.PrintProcessedTemplates(processedTemplates)
    print("== Processed Cards ==")
    debugPrints.PrintAllCardProperties(cards, processedTemplates)
    print("== Processed Effects ==")
    debugPrints.PrintEffects(effects)
end

function love.draw()
    love.graphics.setColor(0, 0, 0)  -- Black text

    local cards = loading.LoadCards()
    local processedTemplates = loading.LoadTemplates()

    for i, card in ipairs(cards) do
        local props = cardsModule.GetCardProperties(card, processedTemplates)
        local yPos = 100 + (i - 1) * 50
        love.graphics.print(props.name .. ": " .. props.text, 100, yPos)
    end
end
