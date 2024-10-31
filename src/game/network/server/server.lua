local socket = require("socket")
local globals = require("network.globals")
local json = require("libs.dkjson.dkjson")
local responseHandler = require("network.response.handle_response")
local logger = require("logger")

local server = {}

server.host = ""
server.port = 12345
server.client = nil
server.mode = "none"


function server:init()
    self.host = globals.server_address
    self.client = socket.tcp()
    self.client:settimeout(5)
    local success, err = self.client:connect(self.host, self.port)
    if not success then
        logger.error("Connection failed: " .. err)
        self.client = nil
    else
        logger.info("Connected to server!")
        self.client:settimeout(0)
    end
end

function server:send(message)
    if self.client then
        self.client:send(message .. "\n")
    else
        logger.error("Not connected to server")
    end
end

function server:sendCommand(command, data)
    local response = {
        command = command,
        data = data
    }
    local jsonMessage = json.encode(response)
    server:send(jsonMessage)
end

function server:receiveResponse()
    local line
        repeat
            line, err = self.client:receive()
            if line then
                local response = json.decode(line)
                self:handleServerResponse(response)
            end
        until not line or err == "timeout"
end

function server:update()
    if self.client then
        self:receiveResponse()

        -- Handle connection errors
        if err and err ~= "timeout" then
            logger.error("Server connection error: " .. err)
            self.client:close()
            self.client = nil
        end
    end
end

function server:handleServerResponse(response)
    local code = tonumber(response.command)
    local data = response.data

    if code == 500 then
        responseHandler.ResponseHandlers["MessageReceived"](code, data)
    else
        responseHandler.ResponseHandlers[globals.state](code, data)
    end
end

function server:close()
    if self.client then
        self.client:close()
        self.client = nil
    end
end

return server
