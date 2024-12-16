local listGameHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")

function listGameServer(command, commandParams)
    globals.state = "ListGames"
    local data = {}
    server:sendCommand(command, data)
end

function listGameHandler.HandleListGameCommand(command, commandParams)
    listGameServer(command, commandParams)
end

return listGameHandler