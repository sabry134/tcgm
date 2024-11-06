package config_loader

import (
	"encoding/json"
	"os"
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
