local private_message_to_user_handler = {}

local logger = require("logger")

function private_message_to_user_handler.HandlePrivateMessageToUserResponse(code, data)
    if code == 200 then
        logger.info("Message is successfully send.")
        local message = data.message
        print(message)
    elseif code == 400 then
        local reason = data.reason
        logger.error(string.format("Message can't be send: %s", reason))
    elseif code == 404 then
        local reason = data.reason
        logger.error(string.format("Message can't be send: %s", reason))
    end 
end

return private_message_to_user_handler