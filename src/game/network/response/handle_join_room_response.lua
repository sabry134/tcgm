local join_room_handler = {}

local logger = require("logger")

function join_room_handler.HandleJoinRoomResponse(code, data)
    if code == 200 then
        logger.info("Room successfully joined.")
        local message = data.message
        print(message)
    elseif code == 400 then
        local reason = data.reason
        logger.error(string.format("Error when joining room : %s", reason))
    end
end

return join_room_handler