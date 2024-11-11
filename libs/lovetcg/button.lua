local BASE = (...):match('(.-)[^%.]+$')
local button = {}

local function draw(text, x,y,w,h)
    love.graphics.setColor(0, 0.4, 0.4)

	love.graphics.rectangle('fill', x,y, w,h)
    love.graphics.setColor(0, 0.6, 0)
    local font_size = 12;
	y = y +  (h - font_size) / 2
	love.graphics.printf(text, x+2, y, w-4, "center")
end

local function update()

end

return function(core, text, x, y, w, h, ...)
	core:addQueueDraw(draw, text, x, y, w, h)
    core:addQueueUpdate(update)
	return {
	}
end
