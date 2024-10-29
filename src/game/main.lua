local server = require("network.server.server")
local p2pCommands = require("network.p2p.p2p_commands")
local server_commands = require("network.server.server_commands")
local globals = require("network.globals")
local networkConfig = require("network.loadNetworkConfig")
local ConfigLoader = require("config.load_config_data")

function love.load()
    local configLoader = ConfigLoader:new()
    configLoader:loadCards("assets/data/cards.json")

    local testCard = configLoader:getCardByName("Red Dragon")
    testCard:printCard()
    networkConfig:LoadNetworkConfig("network/networkConfig.json")
    print("mode is : " .. globals.mode)
end

function love.update()
    if globals.mode == "server" then
        server:update()
    end
end

function love.keypressed(key)
    if globals.mode == "server" then
        server_commands:processCommand(key)
    else
        p2pCommands:processCommand(key)
    end
end

function love.draw()
    if globals.mode == "server" then
        love.graphics.print("Input: " .. globals.inputText, 10, 10)

        if server.mode == "create_room" then
            love.graphics.print("Creating Room: Type room name and press Enter.", 10, 30)
        elseif server.mode == "join_room" then
            love.graphics.print("Joining Room: Type room name and press Enter.", 10, 30)
        elseif server.mode == "none" then
            love.graphics.print("Press 'C' to create, 'J' to join, 'E' to leave, 'U' to list users, 'M' to send a message.", 10, 30)
        end
    end
end

function love.quit()
    if globals.mode == "server" then
        server:close()
    end
end

function love.draw()
    love.graphics.setColor(0, 0, 0)  -- Black text
end
