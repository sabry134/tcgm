package config

import "sync"

type Requirement struct {
	Name       string                 `json:"name"`
	Parameters map[string]interface{} `json:"parameters"`
}

type ActionEffect struct {
	Name       string         `json:"name"`
	Parameters map[string]int `json:"parameters"`
}

type Effect struct {
	Name                  string                 `json:"name"`
	Requirements          []Requirement          `json:"requirements"`
	Actions               []ActionEffect         `json:"actions"`
	ActionResolutionOrder string                 `json:"action_resolution_order"`
	Speed                 string                 `json:"speed"`
	Description           string                 `json:"description"`
	TurnUsageLimit        map[string]interface{} `json:"turn_usage_limit"`
	GameUsageLimit        map[string]interface{} `json:"game_usage_limit"`
	TurnActivationLimit   map[string]interface{} `json:"turn_activation_limit"`
	GameActivationLimit   map[string]interface{} `json:"game_activation_limit"`
}

type Card struct {
	Name             string                 `json:"name"`
	Effects          []Effect               `json:"effects"`
	Types            []string               `json:"types"`
	LimitPerDeck     int                    `json:"limit_per_deck"`
	LimitPerBoard    int                    `json:"limit_per_board"`
	PlayRequirements []Requirement          `json:"play_requirements"`
	CustomValues     map[string]interface{} `json:"custom_values"`
	Keywords         []string               `json:"keywords"`
}

type CardsConfig struct {
	Cards []Card `json:"cards"`
}

var (
	cardsConfig    sync.Once
	CardsConfigVar CardsConfig
)

// GetCardsConfig allows to get the game configuration linked to cards globally.
func GetCardsConfig() CardsConfig {
	return CardsConfigVar
}
