
local game = {}

local networkGlobals = require("network.globals")
local server = require("game.network.server.server")

function game:initGame()
    -- Implement game initialization here
end

function game:createGame()
    local gameInstance = game:initGame()

    local gameCreationRequest = "CREATE_GAME\n"
    server.mode = "create_game"
    server:send(gameCreationRequest)
end

function game:joinGame()
    local joinRequest = "JOIN_GAME\n"
    server.mode = "joining_game"
    server:send(joinRequest)
end

function game:startGame()
    -- Implement game starting logic here
end

function game:listGamesInRoom()
    -- Implement game listing logic
end

function game:matchmakeGame()
-- Implement game matchmaking logic
end
