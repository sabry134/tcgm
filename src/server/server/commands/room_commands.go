package commands

import (
	"fmt"
	"server/server/models"
	"server/server/response"
	"server/server/room"
)

func ViewRoomPasswordCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}

	if client.Room.Owner != client {
		return response.GetErrorResponse(response.CodeForbidden, "You must be room owner for this action.")
	}

	data := map[string]interface{}{
		"password": fmt.Sprintf("Room password is : '%s'.", client.Room.Password),
	}
	return response.CodeSuccess, data
}

func SetRoomPasswordCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}

	if client.Room.Owner != client {
		return response.GetErrorResponse(response.CodeForbidden, "You must be room owner for this action.")
	}

	if !response.CheckForData(msgData, []string{"password"}) {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	newPassword := response.GetMsgDataByName(msgData, "password")

	room.SetPassword(client.Room, newPassword)
	data := map[string]interface{}{
		"message": "Changed room password",
	}
	return response.CodeSuccess, data
}

func LeaveRoomCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room == nil {
		response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	leftRoom := client.Room.Name
	room.LeaveRoom(client.Room, client, s)
	data := map[string]interface{}{
		"message": fmt.Sprintf("You have left room '%s'.", leftRoom),
	}
	return response.CodeSuccess, data
}

func ListUsersCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	usersList := room.GetUsersList(client.Room)
	data := map[string]interface{}{
		"userList": usersList,
	}
	return response.CodeSuccess, data
}

func BroadcastMessageCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}

	if !response.CheckForData(msgData, []string{"message"}) {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	message := response.GetMsgDataByName(msgData, "message")

	room.BroadcastMessage(client.Room, client, message)
	data := map[string]interface{}{
		"message": "Message sent to room.",
	}
	return response.CodeSuccess, data
}

func SendPrivateMessageCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}

	if !response.CheckForData(msgData, []string{"username", "message"}) {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	username := response.GetMsgDataByName(msgData, "username")
	message := response.GetMsgDataByName(msgData, "message")

	if room.SendPrivateMessage(client.Room, client, username, message) {
		data := map[string]interface{}{
			"message": "Message successfully sent.",
		}
		return response.CodeSuccess, data
	} else {
		return response.GetErrorResponse(response.CodeNotFound, "No such user in the room.")
	}
}

func KickUserFromRoomCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	if client != client.Room.Owner {
		return response.GetErrorResponse(response.CodeForbidden, "You must be room owner for this action.")
	}

	if !response.CheckForData(msgData, []string{"username"}) {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	username := response.GetMsgDataByName(msgData, "username")

	if room.KickUser(client.Room, s, username) {
		data := map[string]interface{}{
			"message": fmt.Sprintf("%s has been kicked from the room.", username),
		}
		return response.CodeSuccess, data
	} else {
		return response.GetErrorResponse(response.CodeNotFound, "No such user in the room.")
	}
}

func AppointNewOwnerCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	if client != client.Room.Owner {
		return response.GetErrorResponse(response.CodeForbidden, "You must be room owner for this action.")
	}

	if !response.CheckForData(msgData, []string{"username"}) {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	username := response.GetMsgDataByName(msgData, "username")

	if room.AppointNewOwner(client.Room, username) {
		data := map[string]interface{}{
			"message": fmt.Sprintf("%s is now the owner of the room.", username),
		}
		return response.CodeSuccess, data
	} else {
		return response.GetErrorResponse(response.CodeNotFound, "No such user in the room.")
	}
}

func CloseRoomCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
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
