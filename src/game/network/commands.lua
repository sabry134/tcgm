local networkCommands = {}
local network = require("network.network")
local helpers = require("helpers.helpers")
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
    elseif command == "c" then
        createRoomCommand()
    elseif command == "l" then
        listRoomsCommand()
    elseif command == "j" then
        joinRoomCommand()
    elseif command == "e" then
        leaveRoomCommand()
    elseif command == "q" then
        exitServerCommand()
    elseif command == "u" then
        listUsersCommand()
    elseif command == "m" then
        sendMessageCommand()
    elseif command == "p" then
        sendPrivateMessageCommand()
    elseif command == "k" then
        kickUserCommand()
    elseif command == "o" then
        promoteUserCommand()
    elseif command == "x" then
        closeRoomCommand()
    elseif command == "s" then
        setPasswordCommand()
    elseif command == "v" then
        viewPasswordCommand()
    end
end

local function processCommandLoggedOut(command)
    if command == "space" then
        loginCommand()
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