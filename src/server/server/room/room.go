package room

import (
	"fmt"
	"server/logger"
	"server/server/models"
	"server/server/response"
	"time"
)


// CreateRoom created a new Room object within the server.
func CreateRoom(s *models.Server, client *models.Client, roomName string, roomPassword string) {
	newRoom := &models.Room{Name: roomName, Clients: make(map[*models.Client]bool), Password: roomPassword}

	s.WithLock(func(s *models.Server) {
		s.Rooms[roomName] = newRoom
	})

	client.Room = newRoom

	newRoom.WithLock(func(r *models.Room) {
		newRoom.Clients[client] = true
		newRoom.Owner = client
	})
}

// SetPassword sets the password of a room.
func SetPassword(r *models.Room, password string) {
	r.WithLock(func(r *models.Room) {
		r.Password = password
	})
}

// CloseRoom closes an existing room.
// It sends an info message to all clients in the room to notify them of it.
func CloseRoom(r *models.Room, s *models.Server) {
	data := map[string]interface{}{
		"info": "Room has been closed by owner",
	}

	for client := range r.Clients {
		client.Room = nil
		response.SendInfo(client, data)
		r.WithLock(func(r *models.Room) {
			delete(r.Clients, client)
		})
	}

	s.WithLock(func(s *models.Server) {
		delete(s.Rooms, r.Name)
	})
}

// JoinRoom adds a client to a room.
// It sends an info message to all clients in the room to notify them of it.
func JoinRoom(r *models.Room, client *models.Client) {
	client.Room = r
	r.WithLock(func(r *models.Room) {
		r.Clients[client] = true
	})

	data := map[string]interface{}{
		"info": fmt.Sprintf("%s has joined the room.", client.Name),
	}
	for c := range r.Clients {
		if c != client {
			response.SendInfo(c, data)
		}
	}
}

// LeaveRoom removes the client from the room.
// It sends an info message to all clients in the room to notify them of it.
func LeaveRoom(r *models.Room, client *models.Client, s *models.Server) {
	r.WithLock(func(r *models.Room) {
		delete(r.Clients, client)
	})

	client.Room = nil
	if r.Owner == client || len(r.Clients) == 0 {
		CloseRoom(r, s)
	}

	data := map[string]interface{}{
		"info": fmt.Sprintf("%s has left the room.", client.Name),
	}
	for c := range r.Clients {
		response.SendInfo(c, data)
	}
}

// KickUser removes target player from the room.
// It sends an info message to that client to notify him of it.
func KickUser(r *models.Room, s *models.Server, name string) bool {
	for c := range r.Clients {
		if c.Name == name {
			c.Room = nil
			data := map[string]interface{}{
				"info": "You have been kicked from the room.",
			}
			response.SendInfo(c, data)
			r.WithLock(func(r *models.Room) {
				delete(r.Clients, c)
			})
			return true
		}
	}
	return false
}

// GetRoomsList returns a list of all rooms open on the server.
// It will specify in the response if a room requires a password or not.
func GetRoomsList(s *models.Server) interface{} {
	var roomsList []map[string]interface{}
	for name, room := range s.Rooms {
		roomData := map[string]interface{}{
			"name":             name,
			"requiresPassword": room.Password != "",
		}
		roomsList = append(roomsList, roomData)
	}
	return roomsList
}

// GetUsersList returns a list of all users in a room.
// It will specify in the response if a user is the owner.
func GetUsersList(r *models.Room) interface{} {
	var usersList []map[string]interface{}
	for c := range r.Clients {
		userData := map[string]interface{}{
			"username":  c.Name,
			"roomOwner": c == r.Owner,
		}
		usersList = append(usersList, userData)
	}
	return usersList
}

// getTimeStampAsString returns the current time as a string.
func getTimeStampAsString() string {
	currentTime := time.Now()
	return currentTime.Format("2006-01-02 15:04:05")
}

// BroadcastMessage sends a message to all clients in a room.
// It specifies the message's sender as well as the time it was sent.
func BroadcastMessage(r *models.Room, client *models.Client, message string) {
	data := map[string]interface{}{
		"message":   message,
		"sender":    client.Name,
		"timestamp": getTimeStampAsString(),
	}
	for c := range client.Room.Clients {
		if c != client {
			logger.Debug(fmt.Sprintf("Sending message " + message + " from client: " + client.Name + " to " + c.Name))
			response.SendMessage(c, data)
		}
	}
}

// SendPrivateMessage sends a message to a specified client.
// It specifies the message's sender as well as the time it was sent.
func SendPrivateMessage(r *models.Room, client *models.Client, name string, message string) bool {
	for c := range r.Clients {
		if c != client && c.Name == name {

			data := map[string]interface{}{
				"message":   message,
				"sender":    client.Name,
				"timestamp": getTimeStampAsString(),
			}
			logger.Debug(fmt.Sprintf("Sending private message " + message + " from client: " + client.Name + " to " + c.Name))
			response.SendMessage(c, data)
			return true
		}
	}
	return false
}

// AppointNewOwner changes the owner of a room to a different one.
func AppointNewOwner(r *models.Room, name string) bool {
	for c := range r.Clients {
		if c.Name == name {
			r.WithLock(func(r *models.Room) {
				r.Owner = c
			})
			return true
		}
	}
	return false
}
