local appointNewRoomOwnerHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")

function appointNewRoomOwnerServer(command, commandParams)
    globals.state = "AppointNewRoomOwner"
    local data = {
        username = commandParams[1]
    }
    server:sendCommand(command, data)
end

function appointNewRoomOwnerHandler.HandleAppointNewRoomOwnerCommand(command, commandParams)
    appointNewRoomOwnerServer(command, commandParams)
end

return appointNewRoomOwnerHandler