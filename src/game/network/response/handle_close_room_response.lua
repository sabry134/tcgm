local close_room_handler = {}

local logger = require("logger")

function close_room_handler.HandleCloseRoomResponse(code, data)
    if code == 200 then
        logger.info("The room has sucessfully be close.")
        local message = data.message
        print(message)
    elseif code == 403 then
        local reason = data.reason
        logger.error(string.format("the room can't be close: %s", reason))
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("the room can't be close: %s", reason))
    end
end

return close_room_handler