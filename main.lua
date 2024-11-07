-- Load some default values for our rectangle.
local lovetcg = require "libs/lovetcg"

function love.load()
    love.keyboard.setKeyRepeat(true)
    lovetcg.Button("text", 20, 20, 60, 20);
    lovetcg.Button("bla bla", 60, 80, 60, 20)
    lovetcg.ImageButton("assets/player.jpg", 100, 100, 0, 0.1, 0.1)
    lovetcg.Input(10, 400, 100, 20, "Init")
end

function love.update(dt)
    lovetcg.update()
end

-- Draw a coloured rectangle.
function love.draw()
    -- In versions prior to 11.0, color component values are (0, 102, 102)
    lovetcg.draw()
end

function love.textinput(t)
	-- forward text input to SUIT
	lovetcg.textinput(t)
end

function love.keypressed(key, scancode, isrepeat)
    lovetcg.keypressed(key, scancode, isrepeat)
end