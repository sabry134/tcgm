local create_room_handler = {}

local logger = require("logger")

function create_room_handler.HandleCreateRoomResponse(code, data)
    if code == 200 then
        logger.info("Room successfully created.")
        local message = data.message
        print(message)
    elseif code == 400 then
        local reason = data.reason
        logger.error(string.format("Error when creating room : %s", reason))
    end
end

return create_room_handler