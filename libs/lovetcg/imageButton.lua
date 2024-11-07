local BASE = (...):match('(.-)[^%.]+$')
local imageButton = {
	image = nil,
	x = 0,
	y = 0,
	r = 0,
	sx = 0,
	sy = 0,
	hoveredImage = "",
	clickedImage = "",
	fill = false,
	onDraw = function () end,
	onUpdate = function () end,
}

local isHovered = false;
local isClicked = false;

local function loadImage (path)
	local info = love.filesystem.getInfo( path )
	if info then
		return love.graphics.newImage( path )
	else
		return nil
	end
end

function imageButton:draw(image, x,y, r, sx, sy)
	love.graphics.draw(image, x, y, r, sx, sy)
end

function imageButton:update(core, x,y)
	
end


-- imagePath = path to your image button asset
-- x y w h = coord and size of the imageButton
function imageButton:new(core, imagePath, x, y, r, sx, sy, hoveredPath, clickedPath, onDraw, onUpdate, ...)
	local o = {}
   	setmetatable(o, self)
   	self.__index = self
   	self.x = x or 0
   	self.y = y or 0
	self.r = r or 0
	self.sx = sx or 1
	self.sy = sy or 1
	self.image = loadImage(imagePath)
	self.hoveredImage = loadImage(hoveredPath or ".")
	self.clickedImage = loadImage(clickedPath or ".")
	self.onDraw = onDraw or nil
	self.onUpdate = onUpdate or nil
 	core:addQueueDraw(onDraw or self.draw, self.image, self.x, self.y, self.r, self.sx, self.sy)
	core:addQueueUpdate(onUpdate or self.update, core, self.x, self.y)
   	return o
end

return function(core, text, x, y, onDraw, onUpdate, ...)
   	imageButton:new(core, text, x, y, onDraw, onUpdate, ...)
   	return nil;
end
