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
	

	-- widgets
	Button = function(...) return instance:Button(...) end,

	-- layout
	-- layout = instance.layout
}, {
	-- theme
	
})
