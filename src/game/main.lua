local network = require("network.network")
local commands = require("network.commands")
local globals = require("network.globals")

local state = "waiting"
local roomName = ""

function love.load()
end

function love.update()
    network:update()
end

function love.keypressed(key)
    commands:processCommand(key)
end

function love.draw()
    -- Draw server messages (if you want to display them in a separate area)
    love.graphics.print("Input: " .. globals.inputText, 10, 10)
    
    -- Optionally, display the current mode or prompt
    if network.mode == "create_room" then
        love.graphics.print("Creating Room: Type room name and press Enter.", 10, 30)
    elseif network.mode == "join_room" then
        love.graphics.print("Joining Room: Type room name and press Enter.", 10, 30)
    elseif network.mode == "none" then
        love.graphics.print("Press 'C' to create, 'J' to join, 'E' to leave, 'U' to list users, 'M' to send a message.", 10, 30)
    end
end

function love.quit()
    network:close()
end
