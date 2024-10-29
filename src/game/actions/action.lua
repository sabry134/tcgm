
local Action = {}
Action.__index = Action

function Action:new(name, action_type, required_parameters)
    local action = setmetatable({}, Action)
    local scriptPath = string.format('actions/action_scripts/"%s".lua', name)
    local actionFunc = assert(loadfile(scriptPath))()

    action.name = name
    action.type = action_type
    action.required_parameters = required_parameters or {}
    action.func = actionFunc

    return action
end

return Action
