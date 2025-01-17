This is a Graphic library made for love2d in lua

## How to contribute

if you want to add a widget just add a file with the name of your widget.

this file will have three things:
- An update function
- A Draw Function
- And a function that will initialize the object when called


also try to respect the lua coding style: https://github.com/luarocks/lua-style-guide

## How to use

Put the widget inside load and call draw and update

```lua

local lovetcg = require 'lovetcg'

function love.load()
    lovetcg.Button("text", 20, 20, 60, 20);
end

function love.update(dt)

end

function love.draw()
	lovetcg.draw()
end

```