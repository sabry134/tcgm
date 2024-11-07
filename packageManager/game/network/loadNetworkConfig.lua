local json = require("libs.dkjson.dkjson")
local globals = require("network.globals")

local networkConfig = {}

local function loadConfig(filename)
    local configFile = love.filesystem.read(filename)
    if configFile then
        return json.decode(configFile)
    else
        print("Error loading config.json")
        return nil
    end
end

function networkConfig:LoadNetworkConfig(filename)
    local config = loadConfig(filename)
    globals.mode = config.mode
    globals.p2p_port = config.p2p_port
    globals.server_address = config.server_address
end

return networkConfig
