package models

import (
	"net"
	"sync"
)

type Client struct {
	Conn   net.Conn
	Name   string
	Room   *Room
	Game   *Game
	InGame bool
}

type Room struct {
	Name     string
	Clients  map[*Client]bool
	Games    map[string]*Game
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

type Game struct {
	GameId      string
	Players     map[*Client]bool
	Creator     *Client
	PlayerCount int
	GameStarted bool
	Mu          sync.Mutex
}

// WithLock allows to safely modify an instance of the Room struct.
// It locks the mutex of the Room struct thus blocking other modifications from being done to it at that time.
func (r *Room) WithLock(fn func(*Room)) {
	r.Mu.Lock()
	defer r.Mu.Unlock()
	fn(r)
}

// WithLock allows to safely modify an instance of the Server struct.
// It locks the mutex of the Server struct thus blocking other modifications from being done to it at that time.
func (s *Server) WithLock(fn func(*Server)) {
	s.Mu.Lock()
	defer s.Mu.Unlock()
	fn(s)
}

// WithLock allows to safely modify an instance of the Game struct.
// It locks the mutex of the Game struct thus blocking other modifications from being done to it at that time.
func (g *Game) WithLock(fn func(*Game)) {
	g.Mu.Lock()
	defer g.Mu.Unlock()
	fn(g)
}
