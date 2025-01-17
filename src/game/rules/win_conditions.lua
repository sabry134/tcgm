local WinCondition = {}
WinCondition.__index = WinCondition

function WinCondition:new(name, requirements)
    local winCondition = setmetatable({}, WinCondition)

    winCondition.name = name
    winCondition.requirements = requirements or {}

    return winCondition
end

return WinCondition
