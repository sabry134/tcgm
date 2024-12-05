package commands

import (
	"fmt"
	"server/server/game"
	"server/server/models"
	"server/server/response"
	"server/server/room"
)

// ViewRoomPasswordCommand is the function called when the ViewRoomPassword command is used by a client.
// If the client is in a room and is it's owner, they will be sent the password to the room.
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

// SetRoomPasswordCommand is the function called when the SetRoomPassword command is used by a client.
// If the client is in a room and is it's owner, the password will be changed to the one they sent in the request.
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

// LeaveRoomCommand is the function called when the LeaveRoom command is used by a client.
// If the client is in a room, they will leave it.
func LeaveRoomCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	leftRoom := client.Room.Name
	room.LeaveRoom(client.Room, client, s)
	data := map[string]interface{}{
		"message": fmt.Sprintf("You have left room '%s'.", leftRoom),
	}
	return response.CodeSuccess, data
}

// ListUsersCommand is the function called when the ListUsers command is used by a client.
// If the client is in a room, they will get a list of all users also present in the room.
// The response will contain a list of each user in the room as "userList"
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

// BroadcastMessageCommand is the function called when the BroadcastMessage command is used by a client.
// If the client is in a room, the message sent in the request will be sent to all clients in the room.
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

// SendPrivateMessageCommand is the function called when the SendPrivateMessage command is used by a client.
// If the client is in a room, the message will be sent to a client in that room who's username matches the one sent in the request.
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

// KickUserFromRoomCommand is the function called when the KickUserFromRoom command is used by a client.
// If the client is in a room and is it's owner, the user who's username was in the request will be removed from the room.
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

// AppointNewOwnerCommand is the function called when the AppointNewOwnerCommand command is used by a client.
// If the client is in a room and is it's owner, the client who's username is in the request will be made the new owner of the room.
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

// CloseRoomCommand is the function called when the CloseRoom command is used by a client.
// If the client is in a room and is it's owner, all clients in the room will be removed from it and the room will be closed.
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
		"message": fmt.Sprintf("Room '%s' has been closed.", roomName),
	}
	return response.CodeSuccess, data
}

// CreateGameCommand is the function called when the CreateGame command is used by a client.
// If the client is in a room, and is not currently in a game, they will create a new game of which they will be the creator.
func CreateGameCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	if client.Room == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}
	if client.Game != nil {
		return response.GetErrorResponse(response.CodeError, "You are already in a game. Leave it first to create a new one.")
	}

	game.CreateGame(client.Room, client)

	data := map[string]interface{}{
		"message": "Game created and joined.",
	}
	return response.CodeSuccess, data
}

// JoinGameCommand is the function called when the JoinGame command is used by a client.
// If the client is in a room, is not in a game, and the target game hasn't reached it's max player count, they will join it.
func JoinGameCommand(s *models.Server, client *models.Client, msgData interface{}) (string, interface{}) {
	r := client.Room
	if r == nil {
		return response.GetErrorResponse(response.CodeNotFound, "You are not in a room.")
	}

	if client.Game != nil {
		return response.GetErrorResponse(response.CodeError, "You are already in a game.")
	}

	maxPlayers := 2 // Should get this from rules later
	if client.Game.PlayerCount == maxPlayers {
		return response.GetErrorResponse(response.CodeError, "Game has already reached it's maximum player count.")
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

// ListGamesCommand is the function called when the ListGamesCommand command is used by a client.
// If the client is in a room, they will list the games hosted in that room.
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
