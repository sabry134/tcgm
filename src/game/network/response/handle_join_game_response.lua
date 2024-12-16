local join_game_handler = {}

local logger = require("logger")

function join_game_handler.HandleJoinGameResponse(code, data)
    if code == 200 then
        logger.info("The game has successfully be joined.")
        local message = data.message
        print(message)
    elseif code == 400 then
        local reason = data.reason
        logger.error(string.format("the game can't be joined: %s", reason))
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("the game can't be joined: %s", reason))
    end
end

return join_game_handler