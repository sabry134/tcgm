package config_loader

import (
	"path/filepath"
	"server/game/config"
	"testing"
)

func testFilePath(filename string) string {
	return filepath.Join(".", "testdata", filename)
}

func TestLoadActionsConfig(t *testing.T) {
	var actionsConfig config.ActionsConfig
	err := LoadConfig(testFilePath("actions.json"), &actionsConfig)
	if err != nil {
		t.Fatalf("Failed to load actions.json: %v", err)
	}

	if len(actionsConfig.Actions) != 1 {
		t.Fatalf("Expected 1 action, got %d", len(actionsConfig.Actions))
	}

	action := actionsConfig.Actions[0]
	if action.Name != "Attack" || action.ActionType != "Combat" {
		t.Errorf("Unexpected action data: %+v", action)
	}
}

func TestLoadBattleRulesConfig(t *testing.T) {
	var battleRulesConfig config.BattleRulesConfig
	err := LoadConfig(testFilePath("battle_rules.json"), &battleRulesConfig)
	if err != nil {
		t.Fatalf("Failed to load battle_rules.json: %v", err)
	}

	if !battleRulesConfig.Blocking {
		t.Errorf("Expected blocking to be true, got %v", battleRulesConfig.Blocking)
	}
	if battleRulesConfig.AttackOrder != "one_by_one" {
		t.Errorf("Expected attack_order to be 'one_by_one', got %s", battleRulesConfig.AttackOrder)
	}
}

func TestLoadBoardsConfig(t *testing.T) {
	var boardsConfig config.BoardsConfig
	err := LoadConfig(testFilePath("boards.json"), &boardsConfig)
	if err != nil {
		t.Fatalf("Failed to load boards.json: %v", err)
	}

	if len(boardsConfig.Boards) != 1 {
		t.Fatalf("Expected 1 board, got %d", len(boardsConfig.Boards))
	}

	board := boardsConfig.Boards[0]
	if board.Name != "Field" || board.Area != "free" || !board.OrderedZones {
		t.Errorf("Unexpected board data: %+v", board)
	}
	if len(board.Zones) != 1 || board.Zones[0].ZoneName != "CreatureZone" {
		t.Errorf("Unexpected zone data: %+v", board.Zones)
	}
}

func TestLoadGeneralRulesConfig(t *testing.T) {
	var generalRulesConfig config.GeneralRulesConfig
	err := LoadConfig(testFilePath("general_rules.json"), &generalRulesConfig)
	if err != nil {
		t.Fatalf("Failed to load general_rules.json: %v", err)
	}

	if len(generalRulesConfig.PlayerCount) != 2 || generalRulesConfig.PlayerCount[0] != 2 {
		t.Errorf("Expected player count to be [2, 2], got %v", generalRulesConfig.PlayerCount)
	}
	if generalRulesConfig.StartingHandSize != 5 {
		t.Errorf("Expected starting_hand_size to be 5, got %d", generalRulesConfig.StartingHandSize)
	}
	if generalRulesConfig.ResponseMode != "Stack" {
		t.Errorf("Expected response_mode to be 'Stack', got %s", generalRulesConfig.ResponseMode)
	}
}
