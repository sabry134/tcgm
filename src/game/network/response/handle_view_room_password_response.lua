local view_room_password_handler = {}

local logger = require("logger")

function view_room_password_handler.HandleViewRoomPasswordResponse(code, data)
    if code == 200 then
        logger.info("The password of the room has sucessfully be viewed.")
        local password = data.password
        print(password)
    elseif code == 403 then
        local reason = data.reason
        logger.error(string.format("the password of the room can't be view: %s", reason))
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("the password of the room can't be view: %s", reason))
    end
end

return view_room_password_handler