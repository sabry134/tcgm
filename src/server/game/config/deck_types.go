package config

type DeckType struct {
	Name            string   `json:"name"`
	CardLimitLower  int      `json:"card_limit_lower"`
	CardLimitUpper  int      `json:"card_limit_upper"`
	Public          bool     `json:"public"`
	CopiesLimit     int      `json:"copies_limit"`
	SharedLimitWith []string `json:"shared_limit_with"`
}

type DeckTypesConfig struct {
	DeckTypes []DeckType `json:"decks_types"`
}
