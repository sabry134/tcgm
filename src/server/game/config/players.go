package config

type Player struct {
	Values map[string]interface{} `json:"values"`
}

type PlayersConfig struct {
	Player Player `json:"player"`
}
