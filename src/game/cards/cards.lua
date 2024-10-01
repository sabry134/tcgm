
local Cards = {}

function Cards.GetCardProperties(card, processedTemplates)
    local templatePath = card.template
    local processedTemplate = processedTemplates[templatePath]
    if not processedTemplate then
        error("Template not processed: " .. templatePath)
    end

    local finalProperties = {}
    for k, v in pairs(processedTemplate.properties) do
        finalProperties[k] = card.properties[k] or v
    end

    for k, v in pairs(card.properties) do
        finalProperties[k] = v
    end

    return finalProperties
end

return Cards