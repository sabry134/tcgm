package commands

import (
	"fmt"
	"server/server/client"
	"server/server/models"
	"server/server/response"
	"server/server/room"
)

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
	return response.CodeSuccess, data
}

func ListRoomsCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if len(s.Rooms) == 0 {
		return response.GetErrorResponse(response.CodeNotFound, "No rooms available.")
	}
	roomsList := room.GetRoomsList(s)
	data := map[string]interface{}{
		"roomList": roomsList,
	}
	return response.CodeSuccess, data
}

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
	return response.CodeSuccess, data
}

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
	return response.CodeSuccess, data
}
