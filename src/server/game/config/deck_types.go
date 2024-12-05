package config

import "sync"

type DeckType struct {
	Name            string   `json:"name"`
	CardLimitLower  int      `json:"card_limit_lower"`
	CardLimitUpper  int      `json:"card_limit_upper"`
	Public          bool     `json:"public"`
	CopiesLimit     int      `json:"copies_limit"`
	SharedLimitWith []string `json:"shared_limit_with"`
}

type DeckTypesConfig struct {
	MainDeck  string     `json:"main_deck"`
	DeckTypes []DeckType `json:"decks_types"`
}

var (
	deckTypesConfig    sync.Once
	DeckTypesConfigVar DeckTypesConfig
)

// GetDeckTypesConfig allows to get the game configuration linked to deck types globally.
func GetDeckTypesConfig() DeckTypesConfig {
	return DeckTypesConfigVar
}
