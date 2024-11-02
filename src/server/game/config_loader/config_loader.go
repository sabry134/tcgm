package config_loader

import (
	"encoding/json"
	"io/ioutil"
	"os"
)

func LoadConfig(filePath string, config interface{}) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	byteValue, err := ioutil.ReadAll(file)
	if err != nil {
		return err
	}

	err = json.Unmarshal(byteValue, config)
	if err != nil {
		return err
	}
	return nil
}
