package config

type BattleRulesConfig struct {
	Attackers     []string `json:"attackers"`
	TauntTypes    []string `json:"taunt_types"`
	Blocking      bool     `json:"blocking"`
	FaceAttackers []string `json:"face_attackers"`
	AttackOrder   string   `json:"attack_order"`
}
