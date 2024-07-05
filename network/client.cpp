#include <iostream>
#include <cstring>
#include <unistd.h>
#include <arpa/inet.h>
#include <csignal>
#include <vector>
#include <thread>

void OpenWindow(std::vector<int>& clientSockets);
int clientSocket;
const bool RUNNING = true;

void SignalHandler(int signum) {
    std::cout << "\nInterrupt signal (" << signum << ") received.\n";
    close(clientSocket);
    exit(signum);
}

void CheckServerConnections(std::vector<int>& clientSockets) {
    while (RUNNING) {
        std::string message;

        send(clientSocket, "count", strlen("count"), 0);

        char buffer[1024] = {0};
        recv(clientSocket, buffer, sizeof(buffer), 0);

        int connectedClients = std::stoi(buffer);
        clientSockets.resize(connectedClients);

        std::cout << "Enter a message: (type 'exit' to close the connection)" << std::endl;
        std::getline(std::cin, message);
        std::cout << message << std::endl << "Sending message to the server..." << std::endl;

        send(clientSocket, message.c_str(), message.size(), 0);
        recv(clientSocket, buffer, sizeof(buffer), 0);

        std::cout << "Server response: " << buffer << std::endl;

        if (message == "exit") {
            close(clientSocket);
            exit(0);
        }

        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
}

int main(int argc, char* argv[]) {
    if (argc != 3) {
        std::cerr << "Usage: " << argv[0] << " <IP> <PORT>" << std::endl;
        return 1;
    }

    const char* ip = argv[1];
    int port = std::stoi(argv[2]);

    sockaddr_in serverAddress{};

    if ((clientSocket = socket(AF_INET, SOCK_STREAM, 0)) == 0) {
        std::cerr << "Socket creation failed!" << std::endl;
        return 1;
    }

    serverAddress.sin_family = AF_INET;
    serverAddress.sin_port = htons(port);

    if (inet_pton(AF_INET, ip, &serverAddress.sin_addr) <= 0) {
        std::cerr << "Invalid address or address not supported!" << std::endl;
        return 1;
    }

    if (connect(clientSocket, (struct sockaddr*)&serverAddress, sizeof(serverAddress)) < 0) {
        std::cerr << "Connection failed!" << std::endl;
        return 1;
    }

    std::cout << "Connected to the server!" << std::endl;

    signal(SIGINT, SignalHandler);

    std::vector<int> clientSockets;
    std::thread serverCheckThread(CheckServerConnections, std::ref(clientSockets));

    OpenWindow(clientSockets);

    serverCheckThread.join();

    close(clientSocket);
    return 0;
}
