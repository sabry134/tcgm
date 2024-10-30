package commands

import (
	"fmt"
	"server/server/client"
	"server/server/models"
	"server/server/response"
	"server/server/room"
)

func LogInCommand(s *models.Server, c *models.Client, params []string) (string, interface{}) {
	if c.Name != "" {
		return response.GetErrorResponse(response.CodeError, "Already logged in!.")
	}
	username := ""

	if len(params) >= 1 {
		username = params[0]
	} else {
		return response.GetErrorResponse(response.CodeError, "Must have username as parameter")
	}
	client.LoginClient(s, c, username)
	data := map[string]interface{}{
		"data": fmt.Sprintf("Welcome %s!", username),
	}
	return response.CodeSuccess, data
}

func ListRoomsCommand(s *models.Server, client *models.Client, params []string) (string, interface{}) {
	if len(s.Rooms) == 0 {
		return response.GetErrorResponse(response.CodeNotFound, "No rooms available.")
	}
	roomsList := "Available rooms: "
	for name := range s.Rooms {
		requires_password := ""
		if s.Rooms[name].Password != "" {
			requires_password = " (requires password)"
		}
		roomsList += name + requires_password + ", "
	}
	roomsList = roomsList[:len(roomsList)-2]
	data := map[string]interface{}{
		"data": roomsList,
	}
	return response.CodeSuccess, data
}

func CreateRoomCommand(s *models.Server, client *models.Client, params []string) (string, interface{}) {
	if client.Room != nil {
		return response.GetErrorResponse(response.CodeError, "You are already in a room. Leave it first to create a new one.")
	}

	roomName := ""
	roomPassword := ""

	if len(params) >= 2 {
		roomName = params[0]
		roomPassword = params[1]
	} else {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	if _, exists := s.Rooms[roomName]; exists {
		return response.GetErrorResponse(response.CodeError, "Room name already exists.")
	}

	room.CreateRoom(s, client, roomName, roomPassword)

	data := map[string]interface{}{
		"data": fmt.Sprintf("Room '%s' created and joined.", roomName),
	}
	return response.CodeSuccess, data
}

func JoinRoomCommand(s *models.Server, client *models.Client, params []string) (string, interface{}) {
	if client.Room != nil {
		return response.GetErrorResponse(response.CodeError, "You are already in a room.")
	}

	roomName := ""
	password := ""

	if len(params) >= 2 {
		roomName = params[0]
		password = params[1]
	} else {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

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
		"data": fmt.Sprintf("Joined room '%s'.", roomName),
	}
	return response.CodeSuccess, data
}
