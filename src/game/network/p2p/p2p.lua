local socket = require("socket")
local globals = require("network.globals")
local json = require("libs.dkjson.dkjson")
local responseHandler = require("network.response.handle_response")
local p2pCommands = require("network.p2p.p2p_commands")
local logger      = require("logger")

local p2p = {}

p2p.host = nil
p2p.peer = nil

local function processPeerMessaging(response)
    local code = tonumber(response.command)
    local data = response.data
    logger.debug(string.format("Got message with code : %d", code))

    if code == 500 then
        responseHandler.ResponseHandlers["MessageReceived"](code, data)
    else
        responseHandler.ResponseHandlers[globals.state](code, data)
    end
end

function p2p:receiveResponse()
    local data, err = self.peer:receive()
    if data then
        local response = json.decode(data)
        processPeerMessaging(response)
    elseif err and err ~= "timeout" then
        print("Peer disconnected")
        self.peer:close()
        self.peer = nil
    end
end

function p2p:update()
    if self.peer then
        self:receiveResponse()
    else
        self:checkForIncomingConnection()
    end
end

function p2p:send(message)
    if self.peer then
        local success, err = self.peer:send(message .. "\n")
        if not success then
            print("Failed to send message:", err)
            self.peer:close()
            self.peer = nil
        end
    else
        print("No peer connected.")
    end
end

function p2p:sendCommand(command, data)
    local response = {
        command = command,
        data = data
    }
    local jsonMessage = json.encode(response)
    logger.debug(string.format("about to send json message %s", jsonMessage))
    p2p:send(jsonMessage)
end

function p2p:StartP2P(port)
    logger.info("Starting P2P listener on port: " .. port)
    local listener, err = socket.bind("*", port)
    if not listener then
        logger.error(string.format("Failed to bind to port:%s", err))
        return
    end
    listener:settimeout(0)
    self.host = "self"
    self.listener = listener
end

function p2p:ConnectToPeer(address, port)
    logger.info("Connecting to peer at " .. address .. ":" .. port)
    local peer, err = socket.connect(address, port)
    if peer then
        self.host = address
        logger.info("Connected to peer at " .. address .. ":" .. port)
        peer:settimeout(0)
        self.peer = peer
    else
        logger.error(string.format("Failed to connect to peer:%s", err))
    end
end

function p2p:checkForIncomingConnection()
    if self.listener then
        local peer, err = self.listener:accept()
        if peer then
            logger.info("Peer connected!")
            peer:settimeout(0)
            self.peer = peer
            p2pCommands:SendMessageCommand(self, "Welcome to the room !")
        elseif err and err ~= "timeout" then
            logger.error(string.format("Listener error:%s", err))
        end
    end
end

return p2p
