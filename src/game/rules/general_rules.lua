local GeneralRules = {}
GeneralRules.__index = GeneralRules

function GeneralRules:new(player_count, shared_board, starting_hand_size, maximum_hand_size, can_exceed_max_hand_size, win_conditions, response_mode)
    local generalRules = setmetatable({}, GeneralRules)

    generalRules.player_count = player_count or 2
    generalRules.shared_board = shared_board or false
    generalRules.starting_hand_size = starting_hand_size or 1
    generalRules.maximum_hand_size = maximum_hand_size
    generalRules.can_exceed_max_hand_size = can_exceed_max_hand_size or true
    generalRules.win_conditions = win_conditions or {}
    generalRules.response_mode = response_mode

    return generalRules
end

return GeneralRules
