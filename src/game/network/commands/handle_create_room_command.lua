local createRoomCommandHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")
local logger = require("logger")
local network = require("network.network")

local function createRoomServer(command, commandParams)
    globals.state = "CreateRoom"
    local data = {
        roomName = commandParams[1],
        roomPassword = commandParams[2]
    }

    server:sendCommand(command, data)
end

function createRoomCommandHandler.HandleCreateRoomCommand(command, commandParams)
    createRoomServer(command, commandParams)
end

return createRoomCommandHandler