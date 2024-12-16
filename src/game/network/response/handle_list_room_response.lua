local list_room_handler = {}

local logger = require("logger")

function list_room_handler.HandleListRoomResponse(code, data)
    if code == 200 then
        logger.info("List Room successfully loaded.")
        local listRoom = data.roomList
        for _,room in ipairs(listRoom) do
            logger.debug(room.name)
        end
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("There is no room open : %s", reason))
    end
end

return list_room_handler