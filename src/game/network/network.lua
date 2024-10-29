local socket = require("socket")
local globals = require("network.globals")

local network = {}

network.host = "127.0.0.1" -- Should load from config file later
network.port = 12345
network.client = nil
network.mode = "none"


function network:init()
    self.client = socket.tcp()
    self.client:settimeout(5)
    local success, err = self.client:connect(self.host, self.port)
    if not success then
        print("Connection failed: " .. err)
        self.client = nil
    else
        print("Connected to server!")
        self.client:settimeout(0)
    end
end

function network:send(message)
    if self.client then
        self.client:send(message .. "\n")
    else
        print("Not connected to server")
    end
end

function network:update()
    if self.client then
        local response
        repeat
            response, err = self.client:receive()
            if response then
                -- print("Server says: " .. response)  -- Log received message
                self:handleServerResponse(response)  -- Process the received response
            end
        until not response or err == "timeout"

        -- Handle connection errors
        if err and err ~= "timeout" then
            print("Server connection error: " .. err)
            self.client:close()
            self.client = nil
        end
    end
end

function network:handleServerResponse(response)
    local code, message = response:match("^(%d+)%s(.+)$")

    if code and message then
        code = tonumber(code)
        print("Code is " .. code)
        print("Message is " .. message)
        if code == 200 then
            print("Success :", message)
            self.mode = "none"
        elseif code == 300 then
            print("Server prompt :", message)
            globals.inputText = ""
            self.mode = "responding"
        elseif code == 400 then
            print("Server error :", message)
            self.mode = "none"
        elseif code == 401 then
            print("Invalid password :", message)
            self.mode = "none"
        elseif code == 403 then
            print("Forbidden ressource :", message)
            self.mode = "none"
        elseif code == 404 then
            print("Ressource not found :", message)
            self.mode = "none"
        elseif code == 500 then
            print(message)
            self.mode = "none"
        elseif code == 501 then
            print("Info : ", message)
            self.mode = "none"
        end
    end
end

function network:close()
    if self.client then
        self.client:close()
        self.client = nil
    end
end

return network
