local socket = require("socket")
local globals = require("network.globals")

local p2p = {}

p2p.host = nil

local function processPeerMessaging(message)
    print("Received from peer:", message)
end

local function handlePeerConnection(peer)
    love.update = function(dt)
        local data, err = peer:receive()
        if data then
            processPeerMessaging(data)
        elseif err ~= "timeout" then
            print("Peer disconnected")
            peer:close()
        end
    end
end

function p2p:StartP2P(port)
    print("port is : " .. port)
    local listener = assert(socket.bind("*", port))
    listener:settimeout(0)
    p2p.host = "self"
    print("P2P: Listening on port", port)

    love.update = function(dt)
        local peer, err = listener:accept()
        if peer then
            print("Connected to a peer!")
            peer:settimeout(0)
            handlePeerConnection(peer)
        end
    end
end

function p2p:ConnectToPeer(address, port)
    print("address is " .. address)
    print("port is " .. port)
    local peer = socket.connect(address, port)
    if peer then
        self.host = address
        print("Connected to peer at " .. address .. ":" .. port .. ".")
        peer:settimeout(0)
        handlePeerConnection(peer)
    else
        print("Failed to connect to peer.")
    end
end

return p2p
