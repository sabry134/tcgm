package commands

import (
	"fmt"
	"server/logger"
	"server/server/client"
	"server/server/models"
	"server/server/response"
	"server/server/room"
)

// LogInCommand is the function called when the LogIn command is used by a client.
// If the client is not already logged in, they will be logged in with the username sent in the request.
func LogInCommand(s *models.Server, c *models.Client, msgData interface{}) (string, interface{}) {
	if c.Name != "" {
		return response.GetErrorResponse(response.CodeError, "Already logged in!.")
	}

	if !response.CheckForData(msgData, []string{"username"}) {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	username := response.GetMsgDataByName(msgData, "username")

	client.LoginClient(s, c, username)
	data := map[string]interface{}{
		"message": fmt.Sprintf("Welcome %s!", username),
	}
	logger.Debug(fmt.Sprintf("Logged in user %s succes", c.Name))
	return response.CodeSuccess, data
}

// ListRoomsCommand is the function called when the ListRooms command is used by a client.
// The client will receive a list of rooms open on the server.
func ListRoomsCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if len(s.Rooms) == 0 {
		return response.GetErrorResponse(response.CodeNotFound, "No rooms available.")
	}
	roomsList := room.GetRoomsList(s)
	data := map[string]interface{}{
		"roomList": roomsList,
	}
	logger.Debug("Sending rooms list")
	return response.CodeSuccess, data
}

// CreateRoomCommand is the function called when the CreateRoom command is used by a client.
// The client will create a new room with a name and password that he sent in the request.
// If no password was sent, then "" will be set by default.
func CreateRoomCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room != nil {
		return response.GetErrorResponse(response.CodeError, "You are already in a room. Leave it first to create a new one.")
	}

	if !response.CheckForData(msgData, []string{"roomName", "roomPassword"}) {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	roomName := response.GetMsgDataByName(msgData, "roomName")
	roomPassword := response.GetMsgDataByName(msgData, "roomPassword")

	if _, exists := s.Rooms[roomName]; exists {
		return response.GetErrorResponse(response.CodeError, "Room name already exists.")
	}

	room.CreateRoom(s, client, roomName, roomPassword)

	data := map[string]interface{}{
		"message": fmt.Sprintf("Room '%s' created and joined.", roomName),
	}
	logger.Debug(fmt.Sprintf("Created room with name %s and password %s", roomName, roomPassword))
	return response.CodeSuccess, data
}

// JoinRoomCommand is the function called when the JoinRoom command is used by a client.
// If the client is not in a room, they will join the one they specified in the request if it exists.
// The room password must be sent in the request.
func JoinRoomCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room != nil {
		return response.GetErrorResponse(response.CodeError, "You are already in a room.")
	}

	if !response.CheckForData(msgData, []string{"roomName", "roomPassword"}) {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	roomName := response.GetMsgDataByName(msgData, "roomName")
	password := response.GetMsgDataByName(msgData, "roomPassword")

	r, exists := s.Rooms[roomName]
	if !exists {
		return response.GetErrorResponse(response.CodeNotFound, "Room does not exist.")
	}

	if r.Password != "" {
		if password != r.Password {
			return response.GetErrorResponse(response.CodeInvalidPassword, "Incorrect password.")
		}
	}

	room.JoinRoom(r, client)
	data := map[string]interface{}{
		"message": fmt.Sprintf("Joined room '%s'.", roomName),
	}
	logger.Debug(fmt.Sprintf("User %s joined room %s", client.Name, roomName))
	return response.CodeSuccess, data
}
