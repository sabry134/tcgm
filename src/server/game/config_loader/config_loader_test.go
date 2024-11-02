package config_loader

import (
	"fmt"
	"os"
	"path/filepath"
	"server/game/config"
	"testing"
)

func testFilePath(filename string) string {
	wd, _ := os.Getwd()
	return filepath.Join(wd, "test_data", filename)
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
	if action.Name != "Draw" {
		t.Errorf("Expected action name to be 'Draw', got %s", action.Name)
	}
	if action.ActionType != "Normal" {
		t.Errorf("Expected action type to be 'Normal', got %s", action.ActionType)
	}

	expectedParams := map[string]interface{}{
		"amount": 1,
	}

	if len(action.RequiredParameters) != len(expectedParams) {
		t.Fatalf("Expected %d required parameters, got %d", len(expectedParams), len(action.RequiredParameters))
	}

	for paramName, expectedValue := range expectedParams {
		actualValue, exists := action.RequiredParameters[paramName]
		if !exists {
			t.Errorf("Expected required parameter '%s' not found", paramName)
		} else if !valuesEqual(actualValue, expectedValue) {
			t.Errorf("Expected value for parameter '%s' to be '%v', got '%v' (type: %T vs type: %T)",
				paramName, expectedValue, actualValue, expectedValue, actualValue)
		}
	}
}

func TestLoadBattleRulesConfig(t *testing.T) {
	var battleRulesConfig config.BattleRulesConfig
	fmt.Printf("Loaded BattleRulesConfig: %+v\n", battleRulesConfig)
	err := LoadConfig(testFilePath("battle_rules.json"), &battleRulesConfig)
	if err != nil {
		t.Fatalf("Failed to load battle_rules.json: %v", err)
	}

	if !battleRulesConfig.BattleRules.Blocking {
		t.Errorf("Expected blocking to be true, got %v", battleRulesConfig.BattleRules.Blocking)
	}
	if battleRulesConfig.BattleRules.AttackOrder != "one_by_one" {
		t.Errorf("Expected attack_order to be 'one_by_one', got %s", battleRulesConfig.BattleRules.AttackOrder)
	}
	if !containsString(battleRulesConfig.BattleRules.Attackers, "Creature") {
		t.Errorf("Expected attackers array to contain 'Creature' but it didn't")
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

	if board.Name != "Field" {
		t.Errorf("Unexpected board name, expected 'Field' but got '%s'", board.Name)
	}

	if board.Area != "free" {
		t.Errorf("Unexpected board area, expected 'free' but got '%s'", board.Area)
	}

	if !board.OrderedZones {
		t.Errorf("Expected ordered zones but they were not.")
	}

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

	if len(generalRulesConfig.GeneralRules.PlayerCount) != 2 || generalRulesConfig.GeneralRules.PlayerCount[0] != 2 {
		t.Errorf("Expected player count to be [2, 2], got %v", generalRulesConfig.GeneralRules.PlayerCount)
	}
	if generalRulesConfig.GeneralRules.StartingHandSize != 5 {
		t.Errorf("Expected starting_hand_size to be 5, got %d", generalRulesConfig.GeneralRules.StartingHandSize)
	}
	if generalRulesConfig.GeneralRules.ResponseMode != "Stack" {
		t.Errorf("Expected response_mode to be 'Stack', got %s", generalRulesConfig.GeneralRules.ResponseMode)
	}
}
