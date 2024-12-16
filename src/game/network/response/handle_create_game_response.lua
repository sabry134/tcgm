local create_game_handler = {}

local logger = require("logger")

function create_game_handler.HandlerCreateGameResponse(code, data)
    if code == 200 then
        logger.info("The game has successfully be created.")
        local message = data.message
        print(message)
    elseif code == 403 then
        local reason = data.reason
        logger.error(string.format("the game can't be created: %s", reason))
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("the game can't be created: %s", reason))
    end
end

return create_game_handler