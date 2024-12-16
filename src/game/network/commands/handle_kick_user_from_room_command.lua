local kickUserFromRoomCommandHandler =  {}
local globals = require("network.globals")
local server = require("network.server.server")

function kickUserFromRoom(command, commandParams)
    globals.state = "KickUserFromRoom"
    local data = {
        username = commandParams[1]
    }
    server:sendCommand(command, data)
end

function kickUserFromRoomCommandHandler.HandleKickUserFromRoomCommand(command, commandParams)
    kickUserFromRoom(command, commandParams)
end

return kickUserFromRoomCommandHandler