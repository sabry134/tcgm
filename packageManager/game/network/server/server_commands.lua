local networkCommands = {}
local server = require("network.server.server")
local globals = require("network.globals")

local function createRoomCommand()
    print("Preparing to create a room")
    server.mode = "create_room"
    globals.inputText = ""  -- Clear previous input
    server:send("C")
end

local function listRoomsCommand()
    print("Preparing to list rooms")
    server.mode = "wait_for_server_message"
    server:send("L")
end

local function joinRoomCommand()
    print("Preparing to join a room")
    server.mode = "join_room"
    globals.inputText = ""  -- Clear previous input
    server:send("J")
end

local function leaveRoomCommand()
    print("Preparing to leave room")
    server.mode = "wait_for_server_message"
    server:send("E")
end

local function exitServerCommand()
    print("Disconnecting from server")
    server.mode = "wait_for_server_message"
    server:send("Q")
end

local function listUsersCommand()
    print("Listing users in room")
    server.mode = "wait_for_server_message"
    server:send("U")
end

local function sendMessageCommand()
    print("Sending message to room")
    server.mode = "sending_message"
    globals.inputText = "" -- Clear previous input
    server:send("M")
end

local function loginCommand()
    print("Logging in to server")
    server.mode = "log_in"
    globals.inputText = "" -- Clear previous input
    server:init()
end

local function sendPrivateMessageCommand()
    print("Seding private message")
    server.mode = "select_user"
    globals.inputText = "" -- Clear previous input
    server:send("P")
end

local function kickUserCommand()
    print("Kicking user from room")
    server.mode = "kicking_user"
    globals.inputText = "" -- Clear previous input
    server:send("K")
end

local function promoteUserCommand()
    print("Promoting user to room owner")
    server.mode = "promoting_user"
    globals.inputText = "" -- Clear previous input
    server:send("O")
end

local function closeRoomCommand()
    print("Closing room")
    server.mode = "closing_room"
    server:send("X")
end

local function setPasswordCommand()
    print("Setting room password")
    server.mode = "setting_password"
    globals.inputText = "" -- Clear previous input
    server:send("S")
end

local function viewPasswordCommand()
    print("Viewing password")
    server.mode = "viewing_password"
    server:send("V")
end

local function sendTextInput()
    server:send(globals.inputText)
end

local loggedInCommandHandlers = {
    c = createRoomCommand,
    l = listRoomsCommand,
    j = joinRoomCommand,
    e = leaveRoomCommand,
    q = exitServerCommand,
    u = listUsersCommand,
    m = sendMessageCommand,
    p = sendPrivateMessageCommand,
    k = kickUserCommand,
    o = promoteUserCommand,
    x = closeRoomCommand,
    s = setPasswordCommand,
    v = viewPasswordCommand,
    -- More commands can be added here
}

local loggedOutCommandHandlers = {
    space = loginCommand,
    -- More commands can be added here
}

local function processCommandLoggedIn(command)
    if server.mode == "responding" then
        if command == "return" then
            sendTextInput()
        elseif command == "backspace" then
            -- Handle backspace
            globals.inputText = globals.inputText:sub(1, -2)
        else
            -- Add character to input text
            globals.inputText = globals.inputText .. command
        end
    else
        local handler = loggedInCommandHandlers[command]
        if handler then
            handler()
        else
            print("Unknown command")
        end
    end
end

local function processCommandLoggedOut(command)
    local handler = loggedOutCommandHandlers[command]
    if handler then
        handler()
    else
        print("Unknown command")
    end
end

function networkCommands:processCommand(command)
    if server.client == nil then
        processCommandLoggedOut(command)
    else
        processCommandLoggedIn(command)
    end
end

return networkCommands