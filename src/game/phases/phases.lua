local Phase = {}
Phase.__index = Phase

function Phase:new(name, start_actions, end_actions, allowed_action_types, allowed_effect_speeds)
    local phase = setmetatable({}, Phase)

    phase.name = name
    phase.start_actions = start_actions or {}
    phase.end_actions = end_actions or {}
    phase.allowed_actions = allowed_action_types or {}
    phase.allowed_effect_speeds = allowed_effect_speeds or {}

    return phase
end

return Phase
