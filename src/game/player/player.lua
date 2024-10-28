local Player = {}
Player.__index = Player

function Player:new(name, custom_values)
    local player = setmetatable({}, Player)

    player.name = name
    player.custom_values = custom_values or {}
    return player
end

return Player
