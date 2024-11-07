local lovetcg = {}
lovetcg.__index = lovetcg
local BASE = (...):match('(.-)[^%.]+$')


-- This is the constructor of our lib.
-- You need to add all new widget to it
function lovetcg.new()
  -- local button = require(BASE.."button")

	return setmetatable({
    -- the draw queue that we will call when drawing our ui

    update_queue = {n = 0},

    -- the update queue that we will call when updating our ui

    draw_queue = {n = 0},
    char = '',
    keycode = '',


		Button =  require(BASE.."button"),
    Slider = require(BASE.."slider"),
    ImageButton = require(BASE.."imageButton"),
    Input = require(BASE.."input")


		-- layout = require(BASE.."layout").new(),
	}, lovetcg)
end

-- helper


-- gui state


-- mouse handling
function lovetcg:isHover(mouseX, mouseY, x, y, w, h)
    return mouseX >= x and mouseX <= w + x and mouseY >= y and mouseY <= h + y
end

-- keyboard handling

-- state update
function lovetcg:addQueueUpdate(f, ...)
	table.unpack = table.unpack or unpack -- I know there is a warning but i cant seem to make it work with just table.unpack
  local args = {...}
  local nbargs = select('#', ...)
  if (self.update_queue ~= nil) then
	  self.update_queue.n = self.update_queue.n + 1;

    self.update_queue[self.update_queue.n] = function ()
      f(table.unpack(args, 0, nbargs));
    end;
  end
end

-- draw
-- we will use this to queue each of our draw in the order the user call the function
function lovetcg:addQueueDraw(f, ...)
  table.unpack = table.unpack or unpack -- I know there is a warning but i cant seem to make it work with just table.unpack
  local args = {...}
  local nbargs = select('#', ...)
  if (self.draw_queue ~= nil) then
	  self.draw_queue.n = self.draw_queue.n + 1;

    self.draw_queue[self.draw_queue.n] = function ()
      f(table.unpack(args, 0, nbargs));
    end;
  end

end

function lovetcg:clearChar()
  self.char = ''
end
function lovetcg:clearKeyCode()
  self.keycode = ''
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

function lovetcg:textinput(text)
  self.char = text
end

function lovetcg:keypressed(key, scancode, isrepeat)
  self.keycode = key
end

return lovetcg
