local list_users_in_room_handler = {}

local logger = require("logger")

function list_users_in_room_handler.HandleListUsersInRoomResponse(code, data)
    if code == 200 then
        logger.info("List users in Room successfully loaded.")
        local listUser = data.userList
        for _,user in ipairs(listUser) do
            logger.debug(user.username)
        end
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("The user is not in a room : %s", reason))
    end
end

return list_users_in_room_handler