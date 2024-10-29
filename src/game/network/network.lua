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

function network:old_update()
    if self.client and self.mode ~= "none" then  -- Only check if we're in a mode that requires server interaction
        local response
        repeat
            response, err = self.client:receive()
            if response then
                print("Server says: " .. response)  -- Log received message
                -- You can handle different messages based on the context
                if self.mode == "create_room" then
                    -- Process server message regarding room creation if needed
                elseif self.mode == "join_room" then
                    -- Process server message regarding room joining if needed
                elseif self.mode == "sending_message" then
                    -- process server message sending message if needed
                elseif self.mode == "log_in" then
                    -- proces server message regarding login if needed
                elseif self.mode == "wait_for_server_message" then
                    self.mode = "none"
                end
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

function network:update()
    if self.client then
        local response
        repeat
            response, err = self.client:receive()
            if response then
                print("Server says: " .. response)  -- Log received message
                self:handleServerMessage(response)  -- Process the received message
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

function network:handleServerMessage(message)
    -- Here, you can handle the server message based on the current mode
    if self.mode == "create_room" then
        -- Process server message regarding room creation if needed
    elseif self.mode == "join_room" then
        -- Process server message regarding room joining if needed
    elseif self.mode == "sending_message" then
        -- process server message sending message if needed
    elseif self.mode == "log_in" then
        -- proces server message regarding login if needed
    elseif self.mode == "select_user" then
        -- process server message when selecting user if needed
    elseif self.mode == "kicking_user" then
        -- process server message when kicking user
    elseif self.mode == "promoting_user" then
        -- process server message when promoting user
    elseif self.mode == "setting_password" then
        -- process server message when setting password
    elseif self.mode == "wait_for_server_message" then
        if message == "Enter room password: " then
            globals.inputText = ""
            self.mode = "sending_message"
        else
            self.mode = "none"
        end
    else
        -- process general messages diferently ?
    end
end

function network:close()
    if self.client then
        self.client:close()
        self.client = nil
    end
end

return network
