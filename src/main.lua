local packaging = require 'package_game'  -- Import the packaging logic

-- Game properties
local gameName = "MyGame"  -- Default game name
local gameMessage = "Hello, World!"  -- Default message
local button = {
    x = 400,
    y = 300,
    width = 200,
    height = 50,
    label = "Package User Game",
    isHovered = false,
}

function love.load()
    love.graphics.setBackgroundColor(1, 1, 1)  -- Set background color to white
    love.graphics.setColor(0, 0, 0)            -- Set text color to black
end

function love.update(dt)
    -- Check if the mouse is over the button
    local mouseX, mouseY = love.mouse.getPosition()
    button.isHovered = mouseX >= button.x and mouseX <= button.x + button.width and
                       mouseY >= button.y and mouseY <= button.y + button.height
end

function love.draw()
    -- Draw title
    love.graphics.setColor(0, 0, 0)  -- Set text color to black
    love.graphics.print("User Game Creator", 400, 50)

    -- Draw input fields
    love.graphics.print("Game Name:", 300, 150)
    love.graphics.rectangle("fill", 400, 150, 200, 30)  -- Game name input field
    love.graphics.setColor(1, 1, 1)  -- Set text color to white
    love.graphics.print(gameName, 405, 155)  -- Draw game name

    love.graphics.setColor(0, 0, 0)  -- Set text color to black
    love.graphics.print("Game Message:", 300, 200)
    love.graphics.rectangle("fill", 400, 200, 200, 30)  -- Game message input field
    love.graphics.setColor(1, 1, 1)  -- Set text color to white
    love.graphics.print(gameMessage, 405, 205)  -- Draw game message

    -- Draw the button
    if button.isHovered then
        love.graphics.setColor(0.8, 0.8, 0.8)  -- Change color when hovered
    else
        love.graphics.setColor(0.5, 0.5, 0.5)  -- Normal button color
    end
    love.graphics.rectangle("fill", button.x, button.y, button.width, button.height)
    love.graphics.setColor(0, 0, 0)  -- Reset color to black
    love.graphics.printf(button.label, button.x, button.y + 15, button.width, "center")  -- Center text on button
end

function love.mousepressed(x, y, buttonPressed, istouch)
    if buttonPressed == 1 then  -- Left mouse button
        if button.isHovered then
            packaging.packageGame(gameName, gameMessage)  -- Package the user-created game
        end
    end
end

function love.textinput(t)
    -- Handle input for game name and message
    if love.keyboard.isDown("lshift") or love.keyboard.isDown("rshift") then
        t = string.upper(t)
    end

    if love.mouse.getY() < 180 then
        -- Allow typing into the game name input field
        gameName = gameName .. t
    elseif love.mouse.getY() < 230 then
        -- Allow typing into the game message input field
        gameMessage = gameMessage .. t
    end
end

function love.keypressed(key)
    if key == "backspace" then
        if love.mouse.getY() < 180 then
            gameName = gameName:sub(1, -2)  -- Remove last character from game name
        elseif love.mouse.getY() < 230 then
            gameMessage = gameMessage:sub(1, -2)  -- Remove last character from game message
        end
    end
end
