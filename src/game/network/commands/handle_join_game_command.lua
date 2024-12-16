local joinGameHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")

function joinGameServer(command, commandParams)
    globals.state = "JoinGame"
    local data = {
        gameId = commandParams[1]
    }
    server:sendCommand(command)
end

function joinGameHandler.HandleJoinGameCommand(command, commandParams)
    joinGameServer(command, commandParams)
end

return joinGameHandler