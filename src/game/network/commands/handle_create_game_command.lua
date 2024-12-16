local createGameHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")

function createGameServer(command, commandParams)
    globals.state = "CreateGame"
    local data = {}
    server:sendCommand(command, data)
end

function createGameHandler.HandleCreateGameCommand(command, commandParams)
    createGameServer(command, commandParams)
end

return createGameHandler