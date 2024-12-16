local leaveRoomCommandHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")

local function leaveRoomServer(command, commandParams)
    globals.state="LeaveRoom"
    local data = {}
    server:sendCommand(command, data)
end

function leaveRoomCommandHandler.HandleLeaveRoomCommand(command, commandParams)
    leaveRoomServer(command, commandParams)
end

return leaveRoomCommandHandler