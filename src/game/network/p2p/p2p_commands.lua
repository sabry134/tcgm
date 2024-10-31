local logger = require "logger"
local p2pCommands = {}

function p2pCommands:SendMessageCommand(p2p, contents)
    local data = {
        message = contents,
        sender = "test"
    }
    logger.debug("about to send command to peer.")
    p2p:sendCommand("500", data)
end

return p2pCommands