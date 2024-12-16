local set_room_password_handler = {}

local logger = require("logger")

function set_room_password_handler.HandleSetRoomPasswordResponse(code, data)
    if code == 200 then
        logger.info("The password of the room has successfully be changd.")
        local message = data.message
        print(message)
    elseif code == 403 then
        local reason = data.reason
        logger.error(string.format("The password of the room can't be changed: %s", reason))
    elseif code == 400 then
        local reason = data.reason
        logger.error(string.format("The password of the room can't be changed: %s", reason))
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("The password of the room can't be changed: %s", reason))
    end
end

return set_room_password_handler