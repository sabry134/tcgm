local privateMessageToUserCommandHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")

function privateMessageToUserServer(command, commandParams)
    globals.state = "PrivateMessageToUser"
    local data = {
        username = commandParams[1],
        message = commandParams[2],
    }
    server:sendCommand(command, data)
end

function privateMessageToUserCommandHandler.HandlePrivateMessageToUserCommand(command, commandParams)
    privateMessageToUserServer(command, commandParams)
end

return privateMessageToUserCommandHandler