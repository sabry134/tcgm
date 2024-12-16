local login_handler = require("network.response.handle_login_response")
local create_room_handler = require("network.response.handle_create_room_response")
local join_room_handler = require("network.response.handle_join_room_response")
local message_received_handler = require("network.response.handle_message_received_response")
local info_received_handler = require("network.response.handle_info_received_response")
local leave_room_handler = require("network.response.handle_leave_room_response")
local list_room_handler = require("network.response.handle_list_room_response")
local list_users_in_room_handler = require("network.response.handle_list_users_in_room_response")
local message_to_room_handler = require("network.response.handle_message_to_room_response")
local private_message_to_user_handler = require("network.response.handle_private_message_to_user_response")
local kick_user_from_room_handler = require("network.response.handle_kick_user_from_room_response")
local appoint_new_room_owner_handler = require("network.response.handle_appoint_new_room_owner_response")
local close_room_handler = require("network.response.handle_close_room_response")
local set_room_password_handler = require("network.response.handle_set_room_password_response")
local view_room_password_handler = require("network.response.handle_view_room_password_response")
local create_game_handler = require("network.response.handle_create_game_response")
local join_game_handler = require("network.response.handle_join_game_response")
local leave_game_handler = require("network.response.handle_leave_game_response")
local list_game_handler = require("network.response.handle_list_game_response")

local response_handler = {}

response_handler.ResponseHandlers = {
    Login = login_handler.HandleLoginResponse,
    CreateRoom = create_room_handler.HandleCreateRoomResponse,
    JoinRoom = join_room_handler.HandleJoinRoomResponse,
    MessageReceived = message_received_handler.HandleMessageReceivedResponse,
    InfoReceived = info_received_handler.HandleInfoReceivedResponse,
    LeaveRoom = leave_room_handler.HandleLeaveRoomResponse,
    ListRooms = list_room_handler.HandleListRoomResponse,
    ListUsersInRoom = list_users_in_room_handler.HandleListUsersInRoomResponse,
    MessageToRoom = message_to_room_handler.HandleMessageToRoomResponse,
    PrivateMessageToUser = private_message_to_user_handler.HandlePrivateMessageToUserResponse,
    KickUserFromRoom = kick_user_from_room_handler.HandleKickUserFromRoomResponse,
    AppointNewRoomOwner = appoint_new_room_owner_handler.HandleAppointNewRoomOwnerResponse,
    CloseRoom = close_room_handler.HandleCloseRoomResponse,
    SetRoomPassword = set_room_password_handler.HandleSetRoomPasswordResponse,
    ViewRoomPassword = view_room_password_handler.HandleViewRoomPasswordResponse,
    CreateGame = create_game_handler.HandlerCreateGameResponse,
    JoinGame = join_game_handler.HandleJoinGameResponse,
    LeaveGame = leave_game_handler.HandleLeaveGameResponse,
    ListGames = list_game_handler.HandleListGameResponse,
}

return response_handler
