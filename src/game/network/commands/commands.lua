local networkCommands = {}

local logger  = require("logger")
local loginCommandHandler = require("network.commands.handle_login_command")
local createRoomCommandHandler = require("network.commands.handle_create_room_command")
local joinRoomCommandHandler = require("network.commands.handle_join_room_command")
local leaveRoomCommandHandler = require("network.commands.handle_leave_room_command")
local listRoomCommandHandler = require("network.commands.handle_list_room_command")
local listUsersInRoomCommandHandler = require("network.commands.handle_list_users_in_room_command")
local messageToRoomCommandHandler = require("network.commands.handle_message_to_room_command")
local privateMessageToUserCommandHandler = require("network.commands.handle_private_message_to_user_command")
local kickUserFromRoomCommandHandler = require("network.commands.handle_kick_user_from_room_command")
local appointNewRoomOwnerHandler = require("network.commands.handle_appoint_new_room_owner_command")
local closeRoomHandler = require("network.commands.handle_close_room_command")
local setRoomPasswordHandler = require("network.commands.handle_set_room_password_command")
local viewRoomPasswordHandler = require("network.commands.handle_view_room_password_command")
local createGameHandler = require("network.commands.handle_create_game_command")
local joinGameHandler = require("network.commands.handle_join_game_command")
local leaveGameHandler = require("network.commands.handle_leave_game_command")
local listGameHandler = require("network.commands.handle_list_game_command")

local commandHandlers = {
    Login = loginCommandHandler.HandleLoginCommand,
    CreateRoom = createRoomCommandHandler.HandleCreateRoomCommand,
    JoinRoom = joinRoomCommandHandler.HandleJoinRoomCommand,
    LeaveRoom = leaveRoomCommandHandler.HandleLeaveRoomCommand,
    ListRooms = listRoomCommandHandler.HandleListRoomCommand,
    ListUsersInRoom = listUsersInRoomCommandHandler.HandleListUsersInRoomCommand,
    MessageToRoom = messageToRoomCommandHandler.HandleMessageToRoomCommand,
    PrivateMessageToUser = privateMessageToUserCommandHandler.HandlePrivateMessageToUserCommand,
    KickUserFromRoom = kickUserFromRoomCommandHandler.HandleKickUserFromRoomCommand,
    AppointNewRoomOwner = appointNewRoomOwnerHandler.HandleAppointNewRoomOwnerCommand,
    CloseRoom = closeRoomHandler.HandleCloseRoomCommand,
    SetRoomPassword = setRoomPasswordHandler.HandleSetRoomPasswordCommand,
    ViewRoomPassword = viewRoomPasswordHandler.HandleViewRoomPasswordComand,
    CreateGame = createGameHandler.HandleCreateGameCommand,
    JoinGame = joinGameHandler.HandleJoinGameCommand,
    LeaveGame = leaveGameHandler.HandleLeaveGameCommand,
    ListGames = listGameHandler.HandleListGameCommand,
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
