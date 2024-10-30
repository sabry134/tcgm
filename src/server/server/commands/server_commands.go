package commands

import (
	"fmt"
	"server/server/models"
	"server/server/response"
	"server/server/room"
)

func ListRoomsCommand(s *models.Server, client *models.Client) string {
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

func CreateRoomCommand(s *models.Server, client *models.Client) string {
	if client.Room != nil {
		return "You are already in a room. Leave it first to create a new one."
	}

	response.SendPrompt(client, "Enter room name to create: ")
	roomName := response.ReceiveClientInput(client)

	if _, exists := s.Rooms[roomName]; exists {
		return "Room name already exists."
	}

	response.SendPrompt(client, "Enter room password to create: ")
	roomPassword := response.ReceiveClientInput(client)

	room.CreateRoom(s, client, roomName, roomPassword)

	return fmt.Sprintf("%s Room '%s' created and joined.", response.CodeSuccess, roomName)
}

func JoinRoomCommand(s *models.Server, client *models.Client) string {
	if client.Room != nil {
		return fmt.Sprintf("%s You are already in a room. Leave it first to join another.", response.CodeError)
	}

	response.SendPrompt(client, "Enter room name to join: ")
	roomName := response.ReceiveClientInput(client)

	r, exists := s.Rooms[roomName]
	if !exists {
		return fmt.Sprintf("%s Room does not exist.", response.CodeNotFound)
	}

	if r.Password != "" {
		response.SendPrompt(client, "Enter room password: ")
		password := response.ReceiveClientInput(client)
		if password != r.Password {
			return fmt.Sprintf("%s Incorrect password.", response.CodeInvalidPassword)
		}
	}

	room.JoinRoom(r, client)
	return fmt.Sprintf("%s Joined room '%s'.", response.CodeSuccess, roomName)
}
