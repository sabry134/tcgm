package commands

import (
	"fmt"
	"server/server/client"
	"server/server/models"
	"server/server/response"
	"server/server/room"
)

func LogInCommand(s *models.Server, c *models.Client, params []string) string {
	if c.Name != "" {
		return fmt.Sprintf("%s Already logged in.", response.CodeError)
	}
	username := ""

	if len(params) >= 1 {
		username = params[0]
	} else {
		return fmt.Sprintf("%s Must have rusername as parameter.", response.CodeError)
	}
	client.LoginClient(s, c, username)
	return fmt.Sprintf("%s Welcome %s!", response.CodeSuccess, username)
}

func ListRoomsCommand(s *models.Server, client *models.Client, params []string) string {
	if len(s.Rooms) == 0 {
		return fmt.Sprintf("%s No rooms available.", response.CodeNotFound)
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
	return fmt.Sprintf("%s %s", response.CodeSuccess, roomsList)
}

func CreateRoomCommand(s *models.Server, client *models.Client, params []string) string {
	if client.Room != nil {
		return "You are already in a room. Leave it first to create a new one."
	}

	roomName := ""
	roomPassword := ""

	if len(params) >= 2 {
		roomName = params[0]
		roomPassword = params[1]
	} else {
		return fmt.Sprintf("%s Must have room name and password as parameters.", response.CodeError)
	}

	if _, exists := s.Rooms[roomName]; exists {
		return "Room name already exists."
	}

	room.CreateRoom(s, client, roomName, roomPassword)

	return fmt.Sprintf("%s Room '%s' created and joined.", response.CodeSuccess, roomName)
}

func JoinRoomCommand(s *models.Server, client *models.Client, params []string) string {
	if client.Room != nil {
		return fmt.Sprintf("%s You are already in a room. Leave it first to join another.", response.CodeError)
	}

	roomName := ""
	password := ""

	if len(params) >= 2 {
		roomName = params[0]
		password = params[1]
	} else {
		return fmt.Sprintf("%s Must have room name and password as parameters.", response.CodeError)
	}

	r, exists := s.Rooms[roomName]
	if !exists {
		return fmt.Sprintf("%s Room does not exist.", response.CodeNotFound)
	}

	if r.Password != "" {
		if password != r.Password {
			return fmt.Sprintf("%s Incorrect password.", response.CodeInvalidPassword)
		}
	}

	room.JoinRoom(r, client)
	return fmt.Sprintf("%s Joined room '%s'.", response.CodeSuccess, roomName)
}
