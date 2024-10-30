package handler

import (
	"server/server/commands"
	"server/server/models"
	"server/server/response"
	"strings"
)

type CommandHandler func(*models.Server, *models.Client) string

var commandHandlers = map[string]CommandHandler{
	"C": commands.CreateRoomCommand,
	"J": commands.JoinRoomCommand,
	"E": commands.LeaveRoomCommand,
	"L": commands.ListRoomsCommand,
	"U": commands.ListUsersCommand,
	"M": commands.BroadcastMessageCommand,
	"P": commands.SendPrivateMessageCommand,
	"K": commands.KickUserFromRoomCommand,
	"O": commands.AppointNewOwnerCommand,
	"X": commands.CloseRoomCommand,
	"S": commands.SetRoomPasswordCommand,
	"V": commands.ViewRoomPasswordCommand,
	// Other commands can be added as needed
}

func HandleCommand(s *models.Server, client *models.Client, command string) {
	command = strings.TrimSpace(command)

	if command == "Q" {
		//response = commands.DisconnectClientCommand(s, client)
		return
	}

	if handler, exists := commandHandlers[command]; exists {
		response := handler(s, client)
		if response != "" {
			client.Conn.Write([]byte(response + "\n"))
		}
	} else {
		client.Conn.Write([]byte(response.CodeError + " Unknown command\n"))
	}
}

func oldHandleCommand(s *models.Server, client *models.Client, command string) {
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
