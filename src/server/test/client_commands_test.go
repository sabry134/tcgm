package main_test

import "net"

func clientLogin(client net.Conn, username string) {
	data := map[string]interface{}{
		"username": username,
	}
	sendCommand(client, "Login", data)
}

func clientCreateRoom(client net.Conn, roomName string, roomPassword string) {
	data := map[string]interface{}{
		"roomName":     roomName,
		"roomPassword": roomPassword,
	}
	sendCommand(client, "Create_room", data)
}

func clientJoinRoom(client net.Conn, roomName string, roomPassword string) {
	data := map[string]interface{}{
		"roomName":     roomName,
		"roomPassword": roomPassword,
	}
	sendCommand(client, "Join_room", data)
}
