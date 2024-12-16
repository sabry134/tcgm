local leave_game_handler = {}

local logger = require("logger")

function leave_game_handler.HandleLeaveGameResponse(code, data)
    if code == 200 then
        logger.info("Game has successfully be leaved.")
        local message = data.message
        print(message)
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("The game can't be leaved: %s", reason))
    end  
end

return leave_game_handler