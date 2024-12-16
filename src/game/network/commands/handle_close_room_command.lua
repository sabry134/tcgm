local closeRoomHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")


function closeRoomServer(command, commandParams)
    globals.state = "CloseRoom"
    local data = {}
    server:sendCommand(command, data)
end

function closeRoomHandler.HandleCloseRoomCommand(command, commandParams)
    closeRoomServer(command, commandParams)
end

return closeRoomHandler