local json = require("libs.dkjson.dkjson")
local debugPrints = require("debug.debugPrints")
local cardsModule = require("cards.cards")

local function loadconfig(configPath)
    local file = io.open(configPath, "r")
    if not file then
        error("Configuration file not found: " .. configPath)
    end
    local content = file:read("*a")
    file:close()
    local config = json.decode(content)
    return config
end

local function mergeTemplate(template, parentTemplate)
    local merged = {}

    if parentTemplate then
        for k, v in pairs(parentTemplate.properties) do
            merged.properties = merged.properties or {}
            merged.properties[k] = v
        end
        for _, effect in ipairs(parentTemplate.effects or {}) do
            merged.effects = merged.effects or {}
            table.insert(merged.effects, effect)
        end
    end

    for k, v in pairs(template.properties or {}) do
        merged.properties = merged.properties or {}
        merged.properties[k] = v
    end

    for _, effect in ipairs(template.effects or {}) do
        merged.effects = merged.effects or {}
        table.insert(merged.effects, effect)
    end
    return merged
end

local function processTemplates(templates, parentTemplate, processed, currentName)
    for templateName, template in pairs(templates) do
        local fullName = currentName and (currentName .. "." .. templateName) or templateName

        local merged = mergeTemplate(template, parentTemplate)
        processed[fullName] = merged

        if template.subtypes then
            for _, subtype in ipairs(template.subtypes) do
                local subtypeName = subtype.type
                local fullSubtypeName = fullName .. "." .. subtypeName
                local mergedSubtype = mergeTemplate(subtype, merged)
                processed[fullSubtypeName] = mergedSubtype
            end
        end
    end
end


local typesTemplatesPath = "assets/cards/templates.json"
local typesConfig = loadconfig(typesTemplatesPath)
local typesTemplates = typesConfig.templates

local effectsPath = "assets/effects/effects.json"
local effectsConfig = loadconfig(effectsPath)
local effects = effectsConfig.effects

local cardsPath = "assets/cards/cards.json"
local cardsConfig = loadconfig(cardsPath)
local cards = cardsConfig.cards

local processedTemplates = {}

processTemplates(typesTemplates, nil, processedTemplates)

function love.load()
    love.graphics.setBackgroundColor(1, 1, 1)  -- White background

    debugPrints.PrintProcessedTemplates(processedTemplates)
    print("== Processed Cards ==")
    debugPrints.PrintAllCardProperties(cards, processedTemplates)
    print("== Processed Effects ==")
    debugPrints.PrintEffects(effects)
end

function love.draw()
    love.graphics.setColor(0, 0, 0)  -- Black text
    for i, card in ipairs(cards) do
        local props = cardsModule.GetCardProperties(card, processedTemplates)
        local yPos = 100 + (i - 1) * 50
        love.graphics.print(props.name .. ": " .. props.text, 100, yPos)
    end
end
