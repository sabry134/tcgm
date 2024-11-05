package test

import (
	"bufio"
	"fmt"
	"log"
	"net"
	"strings"
	"sync"
)

type Client struct { // moved
	conn net.Conn
	name string
	room *Room
}

type Room struct { // moved
	name     string
	clients  map[*Client]bool
	owner    *Client
	password string
	mu       sync.Mutex
}

type Server struct { // moved
	rooms   map[string]*Room
	clients map[*Client]bool
	port    int
	mu      sync.Mutex
}

const ( // moved
	CodeSuccess         = "200"
	CodePrompt          = "300"
	CodeError           = "400"
	CodeForbidden       = "403"
	CodeNotFound        = "404"
	CodeInvalidPassword = "401"
	CodeMessage         = "500"
	CodeInfo            = "501"
)

func NewServer() *Server {
	return &Server{rooms: make(map[string]*Room)}
}

func (r *Room) checkAndCloseEmpty(s *Server) {
	if len(r.clients) == 0 {
		r.closeRoom(s)
	}
}

func (s *Server) sendPrompt(client *Client, prompt string) { // moved
	client.conn.Write([]byte(CodePrompt + " " + prompt + "\n"))
}

func (s *Server) sendInfo(client *Client, info string) { // moved
	client.conn.Write([]byte(CodeInfo + " " + info + "\n"))
}

func (s *Server) sendMessage(client *Client, message string) { // moved
	client.conn.Write([]byte(CodeMessage + " " + message + "\n"))
}

func (s *Server) createRoom(client *Client) string { // moved
	if client.room != nil {
		return "You are already in a room. Leave it first to create a new one."
	}

	reader := bufio.NewReader(client.conn)

	s.sendPrompt(client, "Enter room name to create: ")
	roomName, _ := reader.ReadString('\n')
	roomName = strings.TrimSpace(roomName)

	if _, exists := s.rooms[roomName]; exists {
		return "Room name already exists."
	}

	s.sendPrompt(client, "Enter room password to create: ")
	roomPassword, _ := reader.ReadString('\n')
	roomPassword = strings.TrimSpace(roomPassword)

	newRoom := &Room{name: roomName, clients: make(map[*Client]bool), password: roomPassword}
	s.rooms[roomName] = newRoom
	client.room = newRoom
	newRoom.clients[client] = true
	newRoom.owner = client
	return fmt.Sprintf("%s Room '%s' created and joined.", CodeSuccess, roomName)
}

func (s *Server) viewRoomPassword(client *Client) string { // moved
	if client.room == nil {
		return fmt.Sprintf("%s You are not in a room.", CodeNotFound)
	}

	if client.room.owner != client {
		return fmt.Sprintf("%s You must be the room owner to view it's password.", CodeForbidden)
	}

	return fmt.Sprintf("%s Room password is : '%s'.", CodeSuccess, client.room.password)
}

func (s *Server) setRoomPassword(client *Client) string { // moved
	if client.room == nil {
		return fmt.Sprintf("%s You are not in a room.", CodeNotFound)
	}

	if client.room.owner != client {
		return fmt.Sprintf("%s You must be the room owner to set it's password.", CodeForbidden)
	}

	reader := bufio.NewReader(client.conn)

	s.sendPrompt(client, "Enter new room password: ")
	newPassword, _ := reader.ReadString('\n')
	newPassword = strings.TrimSpace(newPassword)

	client.room.password = newPassword
	return fmt.Sprintf("%s Changed room password.", CodeSuccess)
}

func (r *Room) closeRoom(s *Server) { // moved
	for client := range r.clients {
		client.room = nil
		client.conn.Write([]byte("Room has been closed by owner\n"))
		delete(r.clients, client)
	}
	delete(s.rooms, r.name)
}

func (s *Server) joinRoom(client *Client) string { // moved
	if client.room != nil {
		return fmt.Sprintf("%s You are already in a room. Leave it first to join another.", CodeError)
	}

	reader := bufio.NewReader(client.conn)

	s.sendPrompt(client, "Enter room name to join: ")
	roomName, _ := reader.ReadString('\n')
	roomName = strings.TrimSpace(roomName)

	room, exists := s.rooms[roomName]
	if !exists {
		return fmt.Sprintf("%s Room does not exist.", CodeNotFound)
	}

	if room.password != "" {
		s.sendPrompt(client, "Enter room password: ")
		password, _ := reader.ReadString('\n')
		if strings.TrimSpace(password) != room.password {
			return fmt.Sprintf("%s Incorrect password.", CodeInvalidPassword)
		}
	}

	client.room = room
	room.clients[client] = true
	return fmt.Sprintf("%s Joined room '%s'.", CodeSuccess, roomName)
}

func (s *Server) leaveRoom(client *Client) string { // moved
	if client.room == nil {
		return fmt.Sprintf("%s You are not in any room.", CodeNotFound)
	}
	delete(client.room.clients, client)
	leftRoom := client.room.name
	client.room = nil
	return fmt.Sprintf("%s You have left the room '%s'.", CodeSuccess, leftRoom)
}

func (r *Room) kickUser(s *Server, clientToKick *Client) { // moved
	if _, exists := r.clients[clientToKick]; exists {
		clientToKick.room = nil
		s.sendInfo(clientToKick, "You have been kicked from the room.")
		delete(r.clients, clientToKick)
	}
}

func (s *Server) listRooms() string { // moved
	if len(s.rooms) == 0 {
		return fmt.Sprintf("%s No rooms available.", CodeNotFound)
	}
	roomsList := "Available rooms: "
	for name := range s.rooms {
		requires_password := ""
		if s.rooms[name].password != "" {
			requires_password = " (requires password)"
		}
		roomsList += name + requires_password + ", "
	}
	roomsList = roomsList[:len(roomsList)-2]
	return fmt.Sprintf("%s %s", CodeSuccess, roomsList)
}

func (s *Server) listUsers(client *Client) string { // moved
	if client.room == nil {
		return fmt.Sprintf("%s You are not in a room.", CodeNotFound)
	}
	usersList := "Users in room '" + client.room.name + "': "
	for c := range client.room.clients {
		owner := ""
		if c == client.room.owner {
			owner = " (owner)"
		}
		usersList += c.name + owner + ", "
	}
	usersList = usersList[:len(usersList)-2]
	return fmt.Sprintf("%s %s", CodeSuccess, usersList)
}

func (s *Server) broadcastMessage(client *Client) string { // moved
	if client.room == nil {
		return fmt.Sprintf("%s You are not in a room.", CodeNotFound)
	}

	reader := bufio.NewReader(client.conn)

	s.sendPrompt(client, "Enter message to send: ")
	message, _ := reader.ReadString('\n')

	for c := range client.room.clients {
		if c != client {
			fmt.Println("Sending message " + message + " from client: " + client.name + " to " + c.name)
			s.sendMessage(c, client.name+": "+message)
		}
	}
	return fmt.Sprintf("%s Message sent to room.", CodeSuccess)
}

func (s *Server) sendPrivateMessage(client *Client) string { // moved
	if client.room == nil {
		return fmt.Sprintf("%s You are not in a room.", CodeNotFound)
	}

	reader := bufio.NewReader(client.conn)

	s.sendPrompt(client, "Enter username of user to send message to: ")
	name, _ := reader.ReadString('\n')
	name = name[:len(name)-1]

	for c := range client.room.clients {
		if c != client && c.name == name {
			s.sendPrompt(client, "Enter message to send to user: ")

			message, _ := reader.ReadString('\n')
			message = message[:len(message)-1]
			fmt.Println("Sending private message " + message + " from client: " + client.name + " to " + c.name)
			s.sendMessage(c, client.name+": "+message)
			return fmt.Sprintf("%s Message successfully sent.", CodeSuccess)
		}
	}
	return fmt.Sprintf("%s No such user in this room.", CodeNotFound)
}

func (s *Server) kickUserFromRoom(client *Client) string { // moved
	if client.room == nil {
		return fmt.Sprintf("%s You are not in a room.", CodeNotFound)
	}
	if client != client.room.owner {
		return fmt.Sprintf("%s Only the owner can kick users from the room.", CodeForbidden)
	}

	reader := bufio.NewReader(client.conn)

	s.sendPrompt(client, "Enter username of user to be kicked: ")
	name, _ := reader.ReadString('\n')
	name = name[:len(name)-1]

	for c := range client.room.clients {
		if c.name == name {
			client.room.kickUser(s, c)
			return fmt.Sprintf("%s %s has been kicked from the room.", CodeSuccess, name)
		}
	}
	return fmt.Sprintf("%s User not found in the room.", CodeNotFound)
}

func (s *Server) appointNewOwner(client *Client) string { // moved
	if client.room == nil {
		return fmt.Sprintf("%s You are not in a room.", CodeNotFound)
	}
	if client != client.room.owner {
		return fmt.Sprintf("%s Only the owner can kick appoint a new owner.", CodeForbidden)
	}

	reader := bufio.NewReader(client.conn)

	s.sendPrompt(client, "Enter username of user to be made room owner: ")
	name, _ := reader.ReadString('\n')
	name = name[:len(name)-1]

	for c := range client.room.clients {
		if c.name == name {
			client.room.owner = c
			return fmt.Sprintf("%s %s is now the owner of the room.", CodeSuccess, name)
		}
	}
	return fmt.Sprintf("%s User not found in the room.", CodeNotFound)
}

func (s *Server) closeRoomCommand(client *Client) string { // moved
	if client.room == nil {
		return fmt.Sprintf("%s You are not in a room.", CodeNotFound)
	}
	if client != client.room.owner {
		return fmt.Sprintf("%s Only the owner can close the room.", CodeForbidden)
	}
	roomName := client.room.name
	client.room.closeRoom(s)
	return fmt.Sprintf("%s Room '%s' has been closed.", CodeSuccess, roomName)
}

func (s *Server) handleClient(client *Client) { // moved
	defer client.conn.Close()
	reader := bufio.NewReader(client.conn)

	for {
		command, err := reader.ReadString('\n')
		if err != nil {
			break
		}
		command = strings.TrimSpace(command)
		var response string

		switch command {
		case "C":
			response = s.createRoom(client)
		case "J":
			response = s.joinRoom(client)
		case "E":
			response = s.leaveRoom(client)
		case "Q":
			response = "Goodbye!"
			s.disconnectClient(client)
			return
		case "L":
			response = s.listRooms()
		case "U":
			response = s.listUsers(client)
		case "M":
			response = s.broadcastMessage(client)
		case "P":
			response = s.sendPrivateMessage(client)
		case "K":
			response = s.kickUserFromRoom(client)
		case "O":
			response = s.appointNewOwner(client)
		case "X":
			response = s.closeRoomCommand(client)
		case "S":
			response = s.setRoomPassword(client)
		case "V":
			response = s.viewRoomPassword(client)
		default:
			response = "Unknown command"
		}

		client.conn.Write([]byte(response + "\n"))
	}
}

func (s *Server) disconnectClient(client *Client) { // moved
	if client.room != nil {
		s.leaveRoom(client)
	}
	delete(s.clients, client)
	client.conn.Close()
}

func (s *Server) start() { // moved
	listener, err := net.Listen("tcp", fmt.Sprintf(":%d", s.port))
	if err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
	defer listener.Close()

	fmt.Println("Server started on port 12345")

	for {
		conn, err := listener.Accept()
		if err != nil {
			log.Printf("Failed to accept connection: %v", err)
			continue
		}

		client := &Client{
			conn: conn,
			name: "",
			room: nil,
		}

		reader := bufio.NewReader(client.conn)

		s.sendPrompt(client, "Enter your username: ")
		username, _ := reader.ReadString('\n')
		username = strings.TrimSpace(username)

		client.name = username

		s.clients[client] = true

		fmt.Printf("New client connected: %v with username : %s\n", conn.RemoteAddr(), client.name)
		client.conn.Write([]byte(CodeSuccess + " Welcome " + client.name + "!\n"))

		go s.handleClient(client)
	}
}

func main() { // done
	server := &Server{
		rooms:   make(map[string]*Room),
		clients: make(map[*Client]bool),
		port:    12345,
	}
	server.start()
}
