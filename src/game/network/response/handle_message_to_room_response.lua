local message_to_room_handler = {}

local logger = require("logger")

function message_to_room_handler.HandleMessageToRoomResponse(code, data)
    if code == 200 then
        logger.info("Message is successfully send.")
        local message = data.message
        print(message)
    elseif code == 400 then
        local reason = data.reason
        logger.error(string.format("Wrong Parameters : %s", reason))
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("User is not in a room : %s", reason))
    end
end

return message_to_room_handler