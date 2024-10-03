local Load = {}

local processTemplates = require("processTemplates")
local json = require("libs.dkjson.dkjson")

local function loadConfig(configPath)
    local file = io.open(configPath, "r")
    if not file then
        error("Configuration file not found: " .. configPath)
    end
    local content = file:read("*a")
    file:close()
    local config = json.decode(content)
    return config
end

function Load.LoadTemplates()
    local typesTemplatesPath = "assets/cards/templates.json"
    local typesConfig = loadConfig(typesTemplatesPath)
    local typesTemplates = typesConfig.templates

    local processedTemplates = {}
    processTemplates.ProcessTemplates(typesTemplates, nil, processedTemplates)

    return processedTemplates
end

function Load.LoadCards()
    local cardsPath = "assets/cards/cards.json"
    local cardsConfig = loadConfig(cardsPath)
    local cards = cardsConfig.cards

    return cards
end

function Load.LoadEffects()
    local effectsPath = "assets/effects/effects.json"
    local effectsConfig = loadConfig(effectsPath)
    local effects = effectsConfig.effects

    return effects
end

return Load
