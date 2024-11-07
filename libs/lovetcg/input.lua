local BASE = (...):match('(.-)[^%.]+$')
local input = {
	x = 0,
    y = 0,
    width = 0,
    height = 0,
    text = '',
    active = false,
    backgroundColor = { 255, 255, 255, 255 },
    textColor = { 40, 40, 40, 255 },
	onDraw = function () end,
	onUpdate = function () end,
}

function input:draw(o, text, x,y,w,h, backgroundColor, textColor)
    love.graphics.setColor(unpack(o.backgroundColor))
    love.graphics.rectangle('fill', o.x, o.y, o.width, o.height)

    love.graphics.setColor(unpack(o.textColor))
    love.graphics.printf(o.text, o.x, o.y, o.width, 'left')
end

function input:update(core,o, x,y, w, h, active)
	local mousex = love.mouse.getX()
 	local mousey = love.mouse.getY()
	local isHover = core:isHover(mousex, mousey, o.x, o.y, o.width, o.height)
	local isDown = love.mouse.isDown(1)
	if (isHover and isDown) then
		core:clearChar()
		o.active = true
	else if (isDown) then
		o.active = false
		end
	end
	if o.active then
		o.text = o.text .. core.char
		core:clearChar()
	end
	if core.keycode == "backspace" then
		o.text = string.sub(o.text, 1, -2)
		core:clearKeyCode()
	end
end


-- text = initial text of the input
-- x y w h = coord and size of the input
-- backgroundColor = color of the input
-- textColor = color of the input
function input:new(core, x, y, width, height, text, backgroundColor, textColor, onDraw, onUpdate, ...)
	local o = {}
   	setmetatable(o, self)
   	self.__index = self
   	self.x = x or 0
    self.y = y or 0
    self.width = width or 0
    self.height = height or 0
    self.text = text or ''
    self.active = false
    self.backgroundColor = backgroundColor or { 255, 0, 0, 255 }
    self.textColor = textColor or { 40, 40, 40, 255 }
	self.onDraw = onDraw or nil
	self.onUpdate = onUpdate or nil
 	core:addQueueDraw(onDraw or self.draw, o, self.text, self.x, self.y, self.width, self.height, self.backgroundColor, self.textColor)
	core:addQueueUpdate(onUpdate or self.update,  core, o,self.x, self.y)
   	return o
end

return function(core, text, x, y, onDraw, onUpdate, ...)
   	input:new(core, text, x, y, onDraw, onUpdate, ...)
   	return nil;
end
