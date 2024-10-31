local server = require("network.server.server")
local commands = require("network.commands.commands")
local globals = require("network.globals")
local networkConfig = require("network.loadNetworkConfig")
local ConfigLoader = require("config.load_config_data")
local logger = require("logger")

function love.load()
    local configLoader = ConfigLoader:new()
    configLoader:loadCards("assets/data/cards.json")

    local testCard = configLoader:getCardByName("Red Dragon")
    --testCard:printCard()
    networkConfig:LoadNetworkConfig("network/networkConfig.json")
    logger.debug("mode is : " .. globals.mode)
end

function love.update()
    if globals.mode == "server" then
        server:update()
    end
end

function love.textinput(text)
    globals.inputText = globals.inputText .. text
end

function love.keypressed(key)
    if key == "backspace" then
        globals.inputText = globals.inputText:sub(1, -2)
    elseif key == "return" then
        commands:processCommand(globals.inputText)

        globals.inputText = "" -- The input is cleared on sending coommand
    end
end

function love.draw()
    love.graphics.print("Input: " .. globals.inputText, 10, 10)
end

function love.quit()
    if globals.mode == "server" then
        server:close()
    end
end
