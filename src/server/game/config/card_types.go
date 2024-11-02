package config

type PlayRequirement struct {
	Name       string         `json:"name"`
	Parameters map[string]int `json:"parameters"`
}

type CardType struct {
	Name             string            `json:"name"`
	PlayRequirements []PlayRequirement `json:"play_requirements"`
	StartingLocation string            `json:"starting_location"`
	LimitPerDeck     int               `json:"limit_per_deck"`
	LimitPerBoard    int               `json:"limit_per_board"`
	StartingDeckType []string          `json:"starting_deck_type"`
	CustomValues     map[string]int    `json:"custom_values"`
	Keywords         []string          `json:"keywords"`
	ParentType       []string          `json:"parentType"`
}

type CardTypesConfig struct {
	CardTypes []CardType `json:"card_types"`
}
