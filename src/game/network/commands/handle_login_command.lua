local loginCommandHandler = {}
local globals = require("network.globals")
local server = require("network.server.server")

function loginCommandHandler.HandleLoginCommand(command, commandParams)
    globals.state = "Login"
    globals.inputText = "" -- Clear previous input
    server:init()
    local data = {
        username = commandParams[1]
    }
    server:sendCommand(command, data)
end

return loginCommandHandler
