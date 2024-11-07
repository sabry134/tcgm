local BASE = (...) .. "."
local lovetcg = require(BASE .. "core")

local instance = lovetcg.new()
-- This the class index you need to add each function/widget to it
-- This will help initialize our lib
return setmetatable({
	_instance = instance,

	new = lovetcg.new,

	-- core functions (functions in core file)
	draw = function(...) return instance:draw(...) end,
	update = function(...) return instance:update(...) end,
	textinput = function(...) return instance:textinput(...) end,
	
	keypressed = function(...) return instance:keypressed(...) end,
	-- widgets
	Button = function(...) return  instance:Button(...) end,
	Slider = function(...) return instance:Slider(...) end,
	--[[ 
	It takes 6 arguments
		imagePath: The path to your assets
		x: X coord
		y: Y coord
		r(optional): rotation of your image in radian
		sx(optional): X scale of your image
		sy(optional): Y scale of your image
		hoveredPath(optional): path to the image displayed when hovered
		clickedPath(optional): path to the image displayed when clicked 
	]]--
    ImageButton = function(...) return instance:ImageButton(...) end,
    Input = function(...) return instance:Input(...) end,
	-- layout
	-- layout = instance.layout
}, {
	-- theme
	
})
