#include <iostream>
#include <vector>
#include <cstring>
#include <unistd.h>
#include <arpa/inet.h>
#include <SFML/Graphics.hpp>
#include <thread>
#include <map>

constexpr int DEFAULT_PORT = 5000;

void OpenWindow(std::vector<int>& clientSockets);

[[noreturn]] void Server(std::vector<int>& clientSockets, int port) {
    int serverSocket, newSocket;
    sockaddr_in address{};
    int addrlen = sizeof(address);
    int maxClients = SOMAXCONN;
    std::map<int, int> clientIDs;
    int clientIDCounter = 0;

    if ((serverSocket = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        std::cerr << "Socket creation failed!" << std::endl;
        exit(84);
    }

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(port);

    if (bind(serverSocket, (struct sockaddr*)&address, sizeof(address)) < 0) {
        std::cerr << "Bind failed!" << std::endl;
        exit(84);
    }

    if (listen(serverSocket, maxClients) < 0) {
        std::cerr << "Listen failed!" << std::endl;
        exit(84);
    }

    std::cout << "Server started. Listening on port " << port << std::endl;
    while (true) {
        fd_set readFds;

        FD_ZERO(&readFds);
        FD_SET(serverSocket, &readFds);
        int maxSd = serverSocket;

        for (int sd : clientSockets) {
            FD_SET(sd, &readFds);
            if (sd > maxSd)
                maxSd = sd;
        }

        int activity = select(maxSd + 1, &readFds, nullptr, nullptr, nullptr);

        if ((activity < 0) && (errno != EINTR)) {
            std::cerr << "Select error!" << std::endl;
        }

        if (FD_ISSET(serverSocket, &readFds)) {
            if ((newSocket = accept(serverSocket, (struct sockaddr*)&address, (socklen_t*)&addrlen)) < 0) {
                std::cerr << "Accept failed!" << std::endl;
                continue;
            }

            clientSockets.push_back(newSocket);
            clientIDs[newSocket] = clientIDCounter++;
            std::cout << "New client connected! Client ID: " << clientIDs[newSocket] << ", Total players: " << clientSockets.size() << std::endl;
        }

        for (size_t i = 0; i < clientSockets.size(); i++) {
            int sd = clientSockets[i];
            if (FD_ISSET(sd, &readFds)) {
                char buffer[1024];
                int bytesRead = recv(sd, buffer, sizeof(buffer), 0);

                if (bytesRead <= 0) {
                    std::cout << "Player ID " << clientIDs[sd] << " disconnected! Remaining players: " << clientSockets.size() - 1 << std::endl;
                    close(sd);
                    clientIDs.erase(sd);
                    clientSockets.erase(clientSockets.begin() + i);
                    i--;
                } else {
                    buffer[bytesRead] = '\0';
                    std::cout << "Received message from client ID " << clientIDs[sd] << ": " << buffer << std::endl;
                    if (std::strcmp(buffer, "exit") == 0) {
                        std::cout << "Client ID " << clientIDs[sd] << " requested to exit. Disconnecting client." << std::endl;
                        close(sd);
                        clientIDs.erase(sd);
                        clientSockets.erase(clientSockets.begin() + i);
                        i--;
                    } else {
                        // Echo back the message
                        send(sd, buffer, bytesRead, 0);
                    }
                }
            }
        }
    }
}

int main(int argc, char** argv) {
    int port = DEFAULT_PORT;

    if (argc == 3 && std::string(argv[1]) == "-p") {
        port = std::stoi(argv[2]);
    }

    std::vector<int> clientSockets;
    std::thread serverThread(Server, std::ref(clientSockets), port);

    OpenWindow(clientSockets);
    serverThread.join();
    return 0;
}
