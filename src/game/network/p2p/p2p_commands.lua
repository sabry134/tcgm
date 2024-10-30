local p2pCommands = {}
local p2p = require("network.p2p.p2p")
local globals = require("network.globals")

local function createRoom()
    local port = globals.p2p_port
    p2p:StartP2P(port)
end

local function joinRoom()
    local address = "127.0.0.1"
    local port = globals.p2p_port
    p2p:ConnectToPeer(address, port)
end

local loggedInCommandHandlers = {
    -- More commands can be added here
}

local loggedOutCommandHandlers = {
    space = createRoom,
    j = joinRoom,
    -- More commands can be added here
}

local function processCommandLoggedIn(command)
    local handler = loggedInCommandHandlers[command]
    if handler then
        handler()
    else
        print("Unknown command")
    end
end

local function processCommandLoggedOut(command)
    local handler = loggedOutCommandHandlers[command]
    if handler then
        handler()
    else
        print("Unknown command")
    end
end

function p2pCommands:processCommand(command)
    if p2p.host == nil then
        processCommandLoggedOut(command)
    else
        processCommandLoggedIn(command)
    end
end

return p2pCommands