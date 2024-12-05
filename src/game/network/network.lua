local network = {}

local globals = require("network.globals")
local server = require("network.server.server")

function network:sendCommand(command, data)
    server:sendCommand(command, data)
end

return network