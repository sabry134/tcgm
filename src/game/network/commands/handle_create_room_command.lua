local createRoomCommandHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")
local p2p = require("network.p2p.p2p")
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

local function createRoomP2P(command, commandParams)
    local port = commandParams[1]
    p2p:StartP2P(port)
end

function createRoomCommandHandler.HandleCreateRoomCommand(command, commandParams)
    if globals.mode == "server" then
        createRoomServer(command, commandParams)
    else
        createRoomP2P(command, commandParams)
    end
end

return createRoomCommandHandler