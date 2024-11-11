-- Load some default values for our rectangle.
local lovetcg = require "libs/lovetcg"

function love.load()
    lovetcg.Button("text", 20, 20, 60, 20);
end

function love.update(dt)
 
end

-- Draw a coloured rectangle.
function love.draw()
    -- In versions prior to 11.0, color component values are (0, 102, 102)
    lovetcg.draw()
end