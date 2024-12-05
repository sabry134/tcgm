local info_received_handler = {}

local logger = require("logger")

function info_received_handler.HandleInfoReceivedResponse(code, data)
    logger.info("Info received.")
    local info = data.info
    print(string.format("info :%s", info))
end

return info_received_handler
