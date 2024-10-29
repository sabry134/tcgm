package handler

import (
	"server/server/commands"
	"server/server/models"
	"strings"
)

func HandleCommand(s *models.Server, client *models.Client, command string) {
	command = strings.TrimSpace(command)
	var response string

	switch command {
	case "C":
		response = commands.CreateRoomCommand(s, client)
	case "J":
		response = commands.JoinRoomCommand(s, client)
	case "E":
		response = commands.LeaveRoomCommand(s, client)
	case "Q":
		//response = commands.DisconnectClientCommand(s, client)
		return
	case "L":
		response = commands.ListRoomsCommand(s, client)
	case "U":
		response = commands.ListUsersCommand(s, client)
	case "M":
		response = commands.BroadcastMessageCommand(s, client)
	case "P":
		response = commands.SendPrivateMessageCommand(s, client)
	case "K":
		response = commands.KickUserFromRoomCommand(s, client)
	case "O":
		response = commands.AppointNewOwnerCommand(s, client)
	case "X":
		response = commands.CloseRoomCommand(s, client)
	case "S":
		response = commands.SetRoomPasswordCommand(s, client)
	case "V":
		response = commands.ViewRoomPasswordCommand(s, client)
	default:
		response = "Unknown command"
	}

	if response != "" {
		client.Conn.Write([]byte(response + "\n"))
	}
}
