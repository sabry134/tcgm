package commands

import (
	"fmt"
	"server/server/models"
	"server/server/response"
	"server/server/room"
)

func ViewRoomPasswordCommand(s *models.Server, client *models.Client, params []string) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}

	if client.Room.Owner != client {
		return response.GetErrorResponse(response.CodeForbidden, "You must be room owner for this action.")
	}

	data := map[string]interface{}{
		"data": fmt.Sprintf("Room password is : '%s'.", client.Room.Password),
	}
	return response.CodeSuccess, data
}

func SetRoomPasswordCommand(s *models.Server, client *models.Client, params []string) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}

	if client.Room.Owner != client {
		return response.GetErrorResponse(response.CodeForbidden, "You must be room owner for this action.")
	}

	newPassword := ""
	if len(params) >= 1 {
		newPassword = params[0]
	} else {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	room.SetPassword(client.Room, newPassword)
	data := map[string]interface{}{
		"data": "Changed room password",
	}
	return response.CodeSuccess, data
}

func LeaveRoomCommand(s *models.Server, client *models.Client, params []string) (string, interface{}) {
	if client.Room == nil {
		response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	leftRoom := client.Room.Name
	room.LeaveRoom(client.Room, client, s)
	data := map[string]interface{}{
		"data": fmt.Sprintf("You have left room '%s'.", leftRoom),
	}
	return response.CodeSuccess, data
}

func ListUsersCommand(s *models.Server, client *models.Client, params []string) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	usersList := room.ListUsersAsString(client.Room)
	data := map[string]interface{}{
		"data": usersList,
	}
	return response.CodeSuccess, data
}

func BroadcastMessageCommand(s *models.Server, client *models.Client, params []string) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}

	message := ""
	if len(params) >= 1 {
		message = params[0]
	} else {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	room.BroadcastMessage(client.Room, client, message)
	data := map[string]interface{}{
		"data": "Message sent to room.",
	}
	return response.CodeSuccess, data
}

func SendPrivateMessageCommand(s *models.Server, client *models.Client, params []string) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}

	name := ""
	message := ""
	if len(params) >= 2 {
		name = params[0]
		message = params[1]
	} else {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	if room.SendPrivateMessage(client.Room, client, name, message) {
		data := map[string]interface{}{
			"data": "Message successfully sent.",
		}
		return response.CodeSuccess, data
	} else {
		return response.GetErrorResponse(response.CodeNotFound, "No such user in the room.")
	}
}

func KickUserFromRoomCommand(s *models.Server, client *models.Client, params []string) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	if client != client.Room.Owner {
		return response.GetErrorResponse(response.CodeForbidden, "You must be room owner for this action.")
	}

	name := ""
	if len(params) >= 1 {
		name = params[0]
	} else {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	if room.KickUser(client.Room, s, name) {
		data := map[string]interface{}{
			"data": fmt.Sprintf("%s has been kicked from the room.", name),
		}
		return response.CodeSuccess, data
	} else {
		return response.GetErrorResponse(response.CodeNotFound, "No such user in the room.")
	}
}

func AppointNewOwnerCommand(s *models.Server, client *models.Client, params []string) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	if client != client.Room.Owner {
		return response.GetErrorResponse(response.CodeForbidden, "You must be room owner for this action.")
	}

	name := ""
	if len(params) >= 1 {
		name = params[0]
	} else {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	if room.AppointNewOwner(client.Room, name) {
		data := map[string]interface{}{
			"data": fmt.Sprintf("%s is now the owner of the room.", name),
		}
		return response.CodeSuccess, data
	} else {
		return response.GetErrorResponse(response.CodeNotFound, "No such user in the room.")
	}
}

func CloseRoomCommand(s *models.Server, client *models.Client, params []string) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	if client != client.Room.Owner {
		return response.GetErrorResponse(response.CodeForbidden, "You must be room owner for this action.")
	}
	roomName := client.Room.Name
	room.CloseRoom(client.Room, s)
	data := map[string]interface{}{
		"data": fmt.Sprintf("Room '%s' has been closed.", roomName),
	}
	return response.CodeSuccess, data
}
