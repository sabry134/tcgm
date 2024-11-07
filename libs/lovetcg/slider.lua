local BASE = (...):match('(.-)[^%.]+$')
local slider = {
	x = 0,
	y = 0,
	onDraw = function () end,
	onUpdate = function () end,
}

local isHovered = false;
local isClicked = false;

function slider:draw(text, x,y)
    
end

function slider:update(core, x,y)
	
end


-- text = text of the slider
-- x y w h = coord and size of the slider
-- backgroundColor = color of the slider
-- textColor = color of the slider
function slider:new(core, text, x, y, onDraw, onUpdate, ...)
	local o = {}
   	setmetatable(o, self)
   	self.__index = self
   	self.x = x or 0
   	self.y = y or 0
	self.onDraw = onDraw or nil
	self.onUpdate = onUpdate or nil
 	core:addQueueDraw(onDraw or self.draw, text, self.x, self.y)
	core:addQueueUpdate(onUpdate or self.update, core, self.x, self.y)
   	return o
end

return function(core, text, x, y, onDraw, onUpdate, ...)
   	slider:new(core, text, x, y, onDraw, onUpdate, ...)
   	return nil;
end
