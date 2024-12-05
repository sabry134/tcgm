local joinRoomCommandHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")
local logger = require("logger")
local network = require("network.network")

local function joinRoomServer(command, commandParams)
    globals.state = "JoinRoom"
    local data = {
        roomName = commandParams[1],
        roomPassword = commandParams[2]
    }

    server:sendCommand(command, data)
end

function joinRoomCommandHandler.HandleJoinRoomCommand(command, commandParams)
    joinRoomServer(command, commandParams)
end

return joinRoomCommandHandler