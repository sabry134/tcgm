local list_game_handler = {}

local logger = require("logger")

function list_game_handler.HandleListGameResponse(code, data)
    if code == 200 then
        logger.info("List Game has successfull be loaded.")
        local message = data.message
        print(message)
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("List game can't be loaded: %s", reason))
    end  
end

return list_game_handler