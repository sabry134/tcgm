local listRoomCommandHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")


function listRoomServer(command, commandParams)
    globals.state = "ListRooms"
    local data = {}
    server:sendCommand(command, data)
end

function listRoomCommandHandler.HandleListRoomCommand(command, commandParams)
    listRoomServer(command, commandParams)
end

return listRoomCommandHandler