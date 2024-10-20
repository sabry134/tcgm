local BASE = (...):match('(.-)[^%.]+$')
local button = {
	x = 0,
	y = 0,
	w = 0 ,
	h = 0,
	text = "Button",
	backgroundColor = {},
	textColor = {},
	hoveredColor = {},
	clickColor = {},
	onHit = function () end,
	onLongPress = function () end,
	onDraw = function () end,
	onUpdate = function () end,
}

local isHovered = false;
local isClicked = false;

function button:draw(text, x,y,w,h, backgroundColor, hoveredColor, clickColor, textColor)
	local currentFont = love.graphics.getFont()
	love.graphics.setColor(backgroundColor.r, backgroundColor.g, backgroundColor.b, backgroundColor.a)
	if (isHovered) then
    	love.graphics.setColor(hoveredColor.r, hoveredColor.g, hoveredColor.b, hoveredColor.a)
	end
	if (isClicked) then
		love.graphics.setColor(clickColor.r, clickColor.g, clickColor.b, clickColor.a)
	end
	love.graphics.rectangle('fill', x,y, w,h, 4, 4)
    love.graphics.setColor(0, 0.6, 0)

    local font_size = currentFont:getHeight()
	y = y +  (h - font_size) / 2
	love.graphics.printf(text, x, y, w, "center")
end

function button:update(core, x,y,w,h, onHit, onLongPress)
	local mousex = love.mouse.getX()
 	local mousey = love.mouse.getY()
	isHovered = core:isHover(mousex, mousey, x, y, w, h)
	local isDown = love.mouse.isDown(1)
	if (isClicked and not isDown) then
		onHit()
	end
	if (isHovered and isDown) then
		isHovered = false
		isClicked = true
	else 
		isClicked = false
	end
	
end


-- text = text of the button
-- x y w h = coord and size of the button
-- backgroundColor = color of the button
-- textColor = color of the button
function button:new(core, text, x, y, w, h, backgroundColor, hoveredColor, clickColor,textColor, onHit, onLongPress, onDraw, onUpdate, ...)
	local o = {}
   	setmetatable(o, self)
   	self.__index = self
   	self.x = x or 0
   	self.y = y or 0
	self.w = w or 0
	self.h = h or 0
   	self.backgroundColor = backgroundColor or {r = 1 , g = 1, b = 1, a = 1}
   	self.hoveredColor = hoveredColor or {r = 0.4 , g = 0.4, b = 0.4, a = 1}
	self.clickColor = clickColor or {r = 0.7 , g = 0.7, b = 0.7, a = 1}
	self.textColor = textColor or {r = 0 , g = 0, b = 0, a = 1}
	self.onHit = onHit or function () end
	self.onLongPress = onLongPress or nil
	self.onDraw = onDraw or nil
	self.onUpdate = onUpdate or nil
   	core:addQueueDraw(onDraw or self.draw, text, self.x, self.y, self.w, self.h,  self.backgroundColor, self.hoveredColor, self.clickColor, self.textColor)
	core:addQueueUpdate(onUpdate or self.update, core, self.x, self.y, self.w, self.h, self.onHit, self.onLongPress)
   	return o
end

return function(core, text, x, y, w, h, backgroundColor, hoveredColor, clickColor,textColor, onHit, onLongPress, onDraw, onUpdate, ...)
   	button:new(core, text, x, y, w, h, backgroundColor, hoveredColor, clickColor,textColor, onHit, onLongPress, onDraw, onUpdate, ...)
   	return nil;
end
