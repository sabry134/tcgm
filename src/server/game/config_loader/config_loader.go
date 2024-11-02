package config_loader

import (
	"encoding/json"
	"os"
)

func LoadConfig(filePath string, out interface{}) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	return decoder.Decode(out)
}
