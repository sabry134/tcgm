package commands

import (
	"fmt"
	"server/server/models"
	"server/server/response"
	"server/server/room"
)

func ViewRoomPasswordCommand(s *models.Server, client *models.Client) string {
	if client.Room == nil {
		return fmt.Sprintf("%s You are not in a room.", response.CodeNotFound)
	}

	if client.Room.Owner != client {
		return fmt.Sprintf("%s You must be the room owner to view it's password.", response.CodeForbidden)
	}

	return fmt.Sprintf("%s Room password is : '%s'.", response.CodeSuccess, client.Room.Password)
}

func SetRoomPasswordCommand(s *models.Server, client *models.Client) string {
	if client.Room == nil {
		return fmt.Sprintf("%s You are not in a room.", response.CodeNotFound)
	}

	if client.Room.Owner != client {
		return fmt.Sprintf("%s You must be the room owner to set it's password.", response.CodeForbidden)
	}

	response.SendPrompt(client, "Enter new room password: ")
	newPassword := response.ReceiveClientInput(client)

	client.Room.Password = newPassword
	return fmt.Sprintf("%s Changed room password.", response.CodeSuccess)
}

func LeaveRoomCommand(s *models.Server, client *models.Client) string {
	if client.Room == nil {
		return fmt.Sprintf("%s You are not in any room.", response.CodeNotFound)
	}
	leftRoom := client.Room.Name
	room.LeaveRoom(client.Room, client, s)
	return fmt.Sprintf("%s You have left the room '%s'.", response.CodeSuccess, leftRoom)
}

func ListUsersCommand(s *models.Server, client *models.Client) string {
	if client.Room == nil {
		return fmt.Sprintf("%s You are not in a room.", response.CodeNotFound)
	}
	usersList := room.ListUsersAsString(client.Room)
	return fmt.Sprintf("%s %s", response.CodeSuccess, usersList)
}

func BroadcastMessageCommand(s *models.Server, client *models.Client) string {
	if client.Room == nil {
		return fmt.Sprintf("%s You are not in a room.", response.CodeNotFound)
	}

	response.SendPrompt(client, "Enter message to send: ")
	message := response.ReceiveClientInput(client)

	room.BroadcastMessage(client.Room, client, message)
	return fmt.Sprintf("%s Message sent to room.", response.CodeSuccess)
}

func SendPrivateMessageCommand(s *models.Server, client *models.Client) string {
	if client.Room == nil {
		return fmt.Sprintf("%s You are not in a room.", response.CodeNotFound)
	}

	response.SendPrompt(client, "Enter username of user to send message to: ")
	name := response.ReceiveClientInput(client)

	if room.SendPrivateMessage(client.Room, client, name) {
		return fmt.Sprintf("%s Message successfully sent.", response.CodeSuccess)
	} else {
		return fmt.Sprintf("%s No such user in this room.", response.CodeNotFound)
	}
}

func KickUserFromRoomCommand(s *models.Server, client *models.Client) string {
	if client.Room == nil {
		return fmt.Sprintf("%s You are not in a room.", response.CodeNotFound)
	}
	if client != client.Room.Owner {
		return fmt.Sprintf("%s Only the owner can kick users from the room.", response.CodeForbidden)
	}

	response.SendPrompt(client, "Enter username of user to be kicked: ")
	name := response.ReceiveClientInput(client)

	if room.KickUser(client.Room, s, name) {
		return fmt.Sprintf("%s %s has been kicked from the room.", response.CodeSuccess, name)
	} else {
		return fmt.Sprintf("%s User not found in the room.", response.CodeNotFound)
	}
}

func AppointNewOwnerCommand(s *models.Server, client *models.Client) string {
	if client.Room == nil {
		return fmt.Sprintf("%s You are not in a room.", response.CodeNotFound)
	}
	if client != client.Room.Owner {
		return fmt.Sprintf("%s Only the owner can kick appoint a new owner.", response.CodeForbidden)
	}

	response.SendPrompt(client, "Enter username of user to be made room owner: ")
	name := response.ReceiveClientInput(client)

	if room.AppointNewOwner(client.Room, name) {
		return fmt.Sprintf("%s %s is now the owner of the room.", response.CodeSuccess, name)
	} else {
		return fmt.Sprintf("%s User not found in the room.", response.CodeNotFound)
	}
}

func CloseRoomCommand(s *models.Server, client *models.Client) string {
	if client.Room == nil {
		return fmt.Sprintf("%s You are not in a room.", response.CodeNotFound)
	}
	if client != client.Room.Owner {
		return fmt.Sprintf("%s Only the owner can close the room.", response.CodeForbidden)
	}
	roomName := client.Room.Name
	room.CloseRoom(client.Room, s)
	return fmt.Sprintf("%s Room '%s' has been closed.", response.CodeSuccess, roomName)
}
