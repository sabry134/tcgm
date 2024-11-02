package config

type Zone struct {
	ZoneName string `json:"zone_name"`
	Quantity int    `json:"quantity"`
}

type Board struct {
	Name         string `json:"name"`
	Zones        []Zone `json:"zones"`
	Area         string `json:"area"`
	OrderedZones bool   `json:"ordered_zones"`
}

type BoardsConfig struct {
	Boards []Board `json:"boards"`
}
