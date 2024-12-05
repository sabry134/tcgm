package config

import "sync"

type PlayRequirement struct {
	Name       string                 `json:"name"`
	Parameters map[string]interface{} `json:"parameters"`
}

type CardType struct {
	Name             string                 `json:"name"`
	PlayRequirements []PlayRequirement      `json:"play_requirements"`
	StartingLocation string                 `json:"starting_location"`
	LimitPerDeck     int                    `json:"limit_per_deck"`
	LimitPerBoard    int                    `json:"limit_per_board"`
	StartingDeckType []string               `json:"starting_deck_type"`
	CustomValues     map[string]interface{} `json:"custom_values"`
	Keywords         []string               `json:"keywords"`
	ParentType       []string               `json:"parentType"`
}

type CardTypesConfig struct {
	CardTypes []CardType `json:"card_types"`
}

var (
	cardTypesConfig    sync.Once
	CardTypesConfigVar CardTypesConfig
)

// GetCardTypesConfig allows to get the game configuration linked to card types globally.
func GetCardTypesConfig() CardTypesConfig {
	return CardTypesConfigVar
}
