local network = {}

local globals = require("network.globals")
local server = require("network.server.server")
local p2p = require("network.p2p.p2p")

function network:sendCommand(command, data)
    if globals.mode == "server" then
        server:sendCommand(command, data)
    else
        p2p.sendCommand(command, data)
    end
end

return network