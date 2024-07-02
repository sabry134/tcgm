CC := g++
CFLAGS := -Wall -Wextra -std=c++11
LDFLAGS := -lsfml-graphics -lsfml-window -lsfml-system -lsfml-network -pthread

SERVER_SOURCE := server.cpp
CLIENT_SOURCE := client.cpp
GUI_SOURCE := gui.cpp

SERVER_EXECUTABLE := server
CLIENT_EXECUTABLE := client
GUI_EXECUTABLE := gui

.PHONY: all clean fclean re

all: $(SERVER_EXECUTABLE) $(CLIENT_EXECUTABLE)

$(SERVER_EXECUTABLE): $(SERVER_SOURCE) $(GUI_SOURCE)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)

$(CLIENT_EXECUTABLE): $(CLIENT_SOURCE)
	$(CC) $(CFLAGS) -o $@ $^ $(LDFLAGS)


clean:
	rm -f $(SERVER_EXECUTABLE) $(CLIENT_EXECUTABLE) $(GUI_EXECUTABLE)

fclean: clean

re: fclean all
