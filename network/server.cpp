#include <iostream>
#include <vector>
#include <cstring>
#include <unistd.h>
#include <arpa/inet.h>
#include <thread>
#include <map>

constexpr int DEFAULT_PORT = 5000;

void server(std::vector<int>& clientSockets, int port) {
    int serverSocket, newSocket;
    sockaddr_in address;
    int addrlen = sizeof(address);
    int max_clients = SOMAXCONN;
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

    if (listen(serverSocket, max_clients) < 0) {
        std::cerr << "Listen failed!" << std::endl;
        exit(84);
    }

    std::cout << "Server started. Listening on port " << port << std::endl;
    while (true) {
        fd_set readfds;

        FD_ZERO(&readfds);

        FD_SET(serverSocket, &readfds);
        int max_sd = serverSocket;

        for (size_t i = 0; i < clientSockets.size(); i++) {
            int sd = clientSockets[i];
            FD_SET(sd, &readfds);
            if (sd > max_sd)
                max_sd = sd;
        }

        int activity = select(max_sd + 1, &readfds, nullptr, nullptr, nullptr);

        if ((activity < 0) && (errno != EINTR)) {
            std::cerr << "Select error!" << std::endl;
        }

        if (FD_ISSET(serverSocket, &readfds)) {
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
            if (FD_ISSET(sd, &readfds)) {
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
                    if (std::strcmp(buffer, "count") == 0) {
                        std::string count = std::to_string(clientSockets.size());
                        send(sd, count.c_str(), count.size(), 0);
                    } else {
                        std::cout << "Received message from client ID " << clientIDs[sd] << ": " << buffer << std::endl;
                        if (std::strcmp(buffer, "exit") == 0) {
                            std::cout << "Client ID " << clientIDs[sd] << " requested to exit. Disconnecting client." << std::endl;
                            close(sd);
                            clientIDs.erase(sd);
                            clientSockets.erase(clientSockets.begin() + i);
                            i--;
                        } else {
                            send(sd, buffer, bytesRead, 0);
                        }
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

    std::thread serverThread(server, std::ref(clientSockets), port);

    serverThread.join();

    return 0;
}