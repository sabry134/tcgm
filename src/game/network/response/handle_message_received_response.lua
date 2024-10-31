local message_received_handler = {}

local logger = require("logger")

function message_received_handler.HandleMessageReceivedResponse(code, data)
    logger.info("Message received.")
    local message = data.message
    local sender = data.sender
    print(string.format("%s: %s", sender, message))
end

return message_received_handler
