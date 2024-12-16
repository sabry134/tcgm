local appoint_new_room_owner_handler = {}

local logger = require("logger")

function appoint_new_room_owner_handler.HandleAppointNewRoomOwnerResponse(code, data)
    if code == 200 then
        logger.info("Specified User has successfully been owner.")
        local message = data.message
        print(message)
    elseif code == 403 then
        local reason = data.reason
        logger.error(string.format("Specified User can't be owner: %s", reason))
    elseif code == 400 then
        local reason = data.reason
        logger.error(string.format("Specified User can't be owner: %s", reason))
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("specified User can't be owner: %s", reason))
    end
end

return appoint_new_room_owner_handler