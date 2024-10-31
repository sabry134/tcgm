local joinRoomCommandHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")
local p2p = require("network.p2p.p2p")
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

local function joinRoomP2P(command, commandParams)
    local address = commandParams[1]
    local port = commandParams[2]
    p2p:ConnectToPeer(address, port)
end

function joinRoomCommandHandler.HandleJoinRoomCommand(command, commandParams)
    if globals.mode == "server" then
        joinRoomServer(command, commandParams)
    else
        joinRoomP2P(command, commandParams)
    end
end

return joinRoomCommandHandler