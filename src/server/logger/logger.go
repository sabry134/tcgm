package logger

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"
)

type LogLevel struct {
	Name  string
	Color string
}

var (
	INFO    = LogLevel{"INFO", "\033[32m"}    // Green
	WARNING = LogLevel{"WARNING", "\033[33m"} // Yellow
	ERROR   = LogLevel{"ERROR", "\033[31m"}   // Red
	DEBUG   = LogLevel{"DEBUG", "\033[34m"}   // Blue
)

var currentLevel = DEBUG

var logPriority = map[string]int{
	"INFO":    1,
	"WARNING": 2,
	"ERROR":   3,
	"DEBUG":   4,
}

func shouldLog(level LogLevel) bool {
	return logPriority[level.Name] <= logPriority[currentLevel.Name]
}

func logFilePath() string {
	logsDir := "logs"
	err := os.MkdirAll(logsDir, os.ModePerm)
	if err != nil {
		log.Fatalf("Error creating logs directory: %v", err)
	}
	date := time.Now().Format("2006-01-02")
	return filepath.Join(logsDir, fmt.Sprintf("%s.log", date))
}

func logToFile(message string) {
	filePath := logFilePath()
	file, err := os.OpenFile(filePath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatalf("Error opening log file: %v", err)
	}
	defer file.Close()
	_, err = file.WriteString(message + "\n")
	if err != nil {
		log.Fatalf("Error writing to log file: %v", err)
	}
}

func logMessage(level LogLevel, message string) {
	if shouldLog(level) {
		timestamp := time.Now().Format("2006-01-02 15:04:05")
		resetColor := "\033[0m"
		formattedMessage := fmt.Sprintf("%s[%s] %s%s: %s%s",
			level.Color,
			timestamp,
			level.Name,
			resetColor,
			message,
			resetColor,
		)

		fmt.Println(formattedMessage)

		plainMessage := fmt.Sprintf("[%s] %s: %s", timestamp, level.Name, message)
		logToFile(plainMessage)
	}
}

func Info(message string) {
	logMessage(INFO, message)
}

func Warning(message string) {
	logMessage(WARNING, message)
}

func Error(message string) {
	logMessage(ERROR, message)
}

func Debug(message string) {
	logMessage(DEBUG, message)
}
