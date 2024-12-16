local listUsersInRoomCommandHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")

function listUsersInRoomServer(command, commandParams)
    globals.state = "ListUsersInRoom"
    local data = {}
    server:sendCommand(command, data)
end

function listUsersInRoomCommandHandler.HandleListUsersInRoomCommand(command, commandParams)
    listUsersInRoomServer(command, commandParams)
end

return listUsersInRoomCommandHandler