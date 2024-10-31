local login_handler = require("network.response.handle_login_response")
local create_room_handler = require("network.response.handle_create_room_response")
local join_room_handler = require("network.response.handle_join_room_response")
local message_received_handler = require("network.response.handle_message_received_response")

local response_handler = {}

response_handler.ResponseHandlers = {
    Login = login_handler.HandleLoginResponse,
    CreateRoom = create_room_handler.HandleCreateRoomResponse,
    JoinRoom = join_room_handler.HandleJoinRoomResponse,
    MessageReceived = message_received_handler.HandleMessageReceivedResponse,
}

return response_handler
