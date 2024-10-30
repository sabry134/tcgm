package models

import (
	"net"
	"sync"
)

type Client struct {
	Conn net.Conn
	Name string
	Room *Room
}

type Room struct {
	Name     string
	Clients  map[*Client]bool
	Owner    *Client
	Password string
	Mu       sync.Mutex
}

type Server struct {
	Rooms    map[string]*Room
	Clients  map[*Client]bool
	Listener net.Listener
	Port     int
	Mu       sync.Mutex
	Quit     chan struct{}
}

func (r *Room) WithLock(fn func(*Room)) {
	r.Mu.Lock()
	defer r.Mu.Unlock()
	fn(r)
}

func (s *Server) WithLock(fn func(*Server)) {
	s.Mu.Lock()
	defer s.Mu.Unlock()
	fn(s)
}
