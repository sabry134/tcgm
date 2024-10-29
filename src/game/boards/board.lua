local Board = {}
Board.__index = Board

function Board:new(name, zones, area, ordered_zones)
    local board = setmetatable({}, Board)

    board.name = name
    board.zones = zones or {}
    board.area = area
    board.ordered_zones = ordered_zones or true

    return board
end

return Board
