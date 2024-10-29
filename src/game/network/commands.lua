local networkCommands = {}
local network = require("network.network")
local globals = require("network.globals")

local function createRoomCommand()
    print("Preparing to create a room")
    network.mode = "create_room"
    globals.inputText = ""  -- Clear previous input
    network:send("C")
end

local function listRoomsCommand()
    print("Preparing to list rooms")
    network.mode = "wait_for_server_message"
    network:send("L")
end

local function joinRoomCommand()
    print("Preparing to join a room")
    network.mode = "join_room"
    globals.inputText = ""  -- Clear previous input
    network:send("J")
end

local function leaveRoomCommand()
    print("Preparing to leave room")
    network.mode = "wait_for_server_message"
    network:send("E")
end

local function exitServerCommand()
    print("Disconnecting from server")
    network.mode = "wait_for_server_message"
    network:send("Q")
end

local function listUsersCommand()
    print("Listing users in room")
    network.mode = "wait_for_server_message"
    network:send("U")
end

local function sendMessageCommand()
    print("Sending message to room")
    network.mode = "sending_message"
    globals.inputText = "" -- Clear previous input
    network:send("M")
end

local function loginCommand()
    print("Logging in to server")
    network.mode = "log_in"
    globals.inputText = "" -- Clear previous input
    network:init()
end

local function sendPrivateMessageCommand()
    print("Seding private message")
    network.mode = "select_user"
    globals.inputText = "" -- Clear previous input
    network:send("P")
end

local function kickUserCommand()
    print("Kicking user from room")
    network.mode = "kicking_user"
    globals.inputText = "" -- Clear previous input
    network:send("K")
end

local function promoteUserCommand()
    print("Promoting user to room owner")
    network.mode = "promoting_user"
    globals.inputText = "" -- Clear previous input
    network:send("O")
end

local function closeRoomCommand()
    print("Closing room")
    network.mode = "closing_room"
    network:send("X")
end

local function setPasswordCommand()
    print("Setting room password")
    network.mode = "setting_password"
    globals.inputText = "" -- Clear previous input
    network:send("S")
end

local function viewPasswordCommand()
    print("Viewing password")
    network.mode = "viewing_password"
    network:send("V")
end

local function sendTextInput()
    network:send(globals.inputText)
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
    if network.mode == "responding" then
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
    if network.client == nil then
        processCommandLoggedOut(command)
    else
        processCommandLoggedIn(command)
    end
end

return networkCommands