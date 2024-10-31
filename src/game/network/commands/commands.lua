local networkCommands = {}

local logger  = require("logger")
local loginCommandHandler = require("network.commands.handle_login_command")
local createRoomCommandHandler = require("network.commands.handle_create_room_command")
local joinRoomCommandHandler = require("network.commands.handle_join_room_command")

local commandHandlers = {
    Login = loginCommandHandler.HandleLoginCommand,
    CreateRoom = createRoomCommandHandler.HandleCreateRoomCommand,
    JoinRoom = joinRoomCommandHandler.HandleJoinRoomCommand,
    -- More commands can be added here
}

-- function only used for testing
local function parseCommand(command)
    local cmd, args = "", {}

    for word in command:gmatch("%S+") do
        if cmd == "" then
            cmd = word
        else
            table.insert(args, word)
        end
    end

    return cmd, args
end

-- function only used for testing
function networkCommands:processCommand(command)
    local commandName, commandParams = parseCommand(command)
    local handler = commandHandlers[commandName]
    if handler then
        handler(commandName, commandParams)
    else
        logger.error("Unknown command.")
    end
end

return networkCommands
