local leave_room_handler = {}

local logger = require("logger")

function leave_room_handler.HandleLeaveRoomResponse(code, data)
    if code == 200 then
        logger.info("Room successfully leaved.")
        local message = data.message
        print(message)
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("User is not  in the room : %s", reason))
    end
end

return leave_room_handler