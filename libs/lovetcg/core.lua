local lovetcg = {}
lovetcg.__index = lovetcg
local BASE = (...):match('(.-)[^%.]+$')


-- This is the constructor of our lib.
-- You need to add all new widget to it
function lovetcg.new()
	return setmetatable({
		Button = require(BASE.."button"),

    -- the draw queue that we will call when drawing our ui
    draw_queue = {n = 0},
    -- the update queue that we will call when updating our ui
    update_queue = {n = 0},

		-- layout = require(BASE.."layout").new(),
	}, lovetcg)
end

-- helper


-- gui state


-- mouse handling

-- keyboard handling

-- state update
function lovetcg:addQueueUpdate(f, ...)
	table.unpack = table.unpack or unpack -- I know there is a warning but i cant seem to make it work with just table.unpack
  local args = {...}
  local nbargs = select('#', ...)
	self.update_queue.n = self.update_queue.n + 1;

  self.update_queue[self.update_queue.n] = function ()
    f(table.unpack(args, 1 , nbargs));
  end;
end

-- draw
-- we will use this to queue each of our draw in the order the user call the function
function lovetcg:addQueueDraw(f, ...)
  table.unpack = table.unpack or unpack -- I know there is a warning but i cant seem to make it work with just table.unpack
  local args = {...}
  local nbargs = select('#', ...)
	self.draw_queue.n = self.draw_queue.n + 1;

  self.draw_queue[self.draw_queue.n] = function ()
    f(table.unpack(args, 1 , nbargs));
  end;
end


function lovetcg:draw()
  for i = 1, self.draw_queue.n, 1 do
    self.draw_queue[i]()
  end
end

function lovetcg:update()
  for i = 1, self.update_queue.n, 1 do
    self.update_queue[i]()
  end
end

return lovetcg
