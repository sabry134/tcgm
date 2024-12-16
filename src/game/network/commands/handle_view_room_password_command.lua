local viewRoomPasswordHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")

function viewRoomPasswordServer(command, commandParams)
    globals.state = "ViewRoomPassword"
    local data = {}
    server:sendCommand(command, data)
end

function viewRoomPasswordHandler.HandleViewRoomPasswordComand(command, commandParams)
    viewRoomPasswordServer(command, commandParams)
end

return viewRoomPasswordHandler