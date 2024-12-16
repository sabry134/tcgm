local messageToRoomCommandHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")

function messageToRoomServer(command, commandParams)
    globals.state = "MessageToRoom"
    local data = {
        message = commandParams[1]
    }
    server:sendCommand(command, data)
end

function messageToRoomCommandHandler.HandleMessageToRoomCommand(command, commandParams)
    messageToRoomServer(command, commandParams)
end

return messageToRoomCommandHandler