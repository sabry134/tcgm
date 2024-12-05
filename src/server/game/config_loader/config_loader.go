package config_loader

import (
	"encoding/json"
	"os"
	"server/game/config"
)

// LoadConfig loads configuration from a json file into a predefined struct.
// The out parameter corresponds to the already instantiated struct the data should be stored in.
func LoadConfig(filePath string, out interface{}) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	return decoder.Decode(out)
}

// LoadAllConfigs loads the configuration for all required config files and returns an error if any of them does.
func LoadAllConfigs() error {
	configs := []struct {
		filePath string
		out      interface{}
	}{
		{"game/config_loader/test_data/actions.json", config.ActionsConfigVar},
		{"game/config_loader/test_data/battle_rules.json", config.BattleRulesConfigVar},
		{"game/config_loader/test_data/boards.json", config.BoardsConfigVar},
		{"game/config_loader/test_data/card_types.json", config.CardTypesConfigVar},
		{"game/config_loader/test_data/cards.json", config.CardsConfigVar},
		{"game/config_loader/test_data/deck_types.json", config.DeckTypesConfigVar},
		{"game/config_loader/test_data/general_rules.json", config.GeneralRulesConfigVar},
		{"game/config_loader/test_data/phases.json", config.PhasesConfigVar},
		{"game/config_loader/test_data/players.json", config.PlayersConfigVar},
		{"game/config_loader/test_data/win_conditions.json", config.WinConditionsConfigVar},
	}

	for _, cfg := range configs {
		if err := LoadConfig(cfg.filePath, cfg.out); err != nil {
			return err
		}
	}

	return nil
}
