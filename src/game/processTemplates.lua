local ProcessTemplates = {}

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

function ProcessTemplates.ProcessTemplates(templates, parentTemplate, processed, currentName)
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

return ProcessTemplates
