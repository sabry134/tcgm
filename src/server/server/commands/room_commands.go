package commands

import (
	"fmt"
	"server/server/game"
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

func CreateGameCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	if client.Game != nil {
		return response.GetErrorResponse(response.CodeError, "You are already in a game. Leave it first to create a new one.")
	}

	game.CreateGame(client.Room, client)

	data := map[string]interface{}{
		"message": fmt.Sprintf("Game created and joined."),
	}
	return response.CodeSuccess, data
}

func JoinGameCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	r := client.Room
	if r == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	if client.Game != nil {
		return response.GetErrorResponse(response.CodeError, "You are already in a game.")
	}

	if !response.CheckForData(msgData, []string{"gameId"}) {
		return response.GetErrorResponse(response.CodeError, "Wrong parameters to command.")
	}

	gameId := response.GetMsgDataByName(msgData, "gameId")

	g, exists := r.Games[gameId]
	if !exists {
		return response.GetErrorResponse(response.CodeNotFound, "Game does not exist.")
	}

	game.JoinGame(g, client)

	data := map[string]interface{}{
		"message": fmt.Sprintf("Joined game '%s'.", gameId),
	}
	return response.CodeSuccess, data
}

func ListGamesCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	r := client.Room

	if len(r.Games) == 0 {
		return response.GetErrorResponse(response.CodeNotFound, "No games available.")
	}
	gamesList := game.GetGamesList(r)
	data := map[string]interface{}{
		"gamesList": gamesList,
	}
	return response.CodeSuccess, data
}
