local setRoomPasswordHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")

function setRoomPasswordServer(command, commandParams)
    globals.state = "SetRoomPassword"
    local data = {
        password = commandParams[1]
    }
    server:sendCommand(command, data)
end

function setRoomPasswordHandler.HandleSetRoomPasswordCommand(command, commandParams)
    setRoomPasswordServer(command, commandParams)
end

return setRoomPasswordHandler