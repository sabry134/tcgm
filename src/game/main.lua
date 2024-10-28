local debugPrints = require("debug.debugPrints")
local cardsModule = require("cards.cards")
local ConfigLoader = require("config.load_config_data")
local ConfigPrinter = require("config.config_print")

function love.load()
    love.graphics.setBackgroundColor(1, 1, 1)  -- White background

    -- Main game setup
    local configLoader = ConfigLoader:new()
    configLoader:LoadCards("cards.json")
end

function love.draw()
    love.graphics.setColor(0, 0, 0)  -- Black text
end
