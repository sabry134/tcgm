local kick_user_from_room_handler = {}

local logger = require("logger")

function kick_user_from_room_handler.HandleKickUserFromRoomResponse(code, data)
    if code == 200 then
        logger.info("User has successfully been kicked.")
        local message = data.message
        print(message)
    elseif code == 403 then
        local reason = data.reason
        logger.error(string.format("User can't be kicked: %s", reason))
    elseif code == 400 then
        local reason = data.reason
        logger.error(string.format("User can't be kicked: %s", reason))
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("User can't be kicked: %s", reason))
    end
end

return kick_user_from_room_handler