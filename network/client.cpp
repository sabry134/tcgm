#include <iostream>
#include <cstring>
#include <unistd.h>
#include <arpa/inet.h>
#include <csignal>
#include <vector>
#include <thread>

void open_window(std::vector<int>& clientSockets);
int clientSocket;
bool running = true;

void signalHandler(int signum) {
    std::cout << "\nInterrupt signal (" << signum << ") received.\n";
    close(clientSocket);
    exit(signum);
}

void checkServerConnections(std::vector<int>& clientSockets) {
    while (running) {
        send(clientSocket, "count", strlen("count"), 0);

        char buffer[1024] = {0};
        recv(clientSocket, buffer, sizeof(buffer), 0);

        int connectedClients = std::stoi(buffer);
        clientSockets.resize(connectedClients);

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

    sockaddr_in serverAddress;

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

    signal(SIGINT, signalHandler);

    std::vector<int> clientSockets;
    std::thread serverCheckThread(checkServerConnections, std::ref(clientSockets));

    open_window(clientSockets);

    serverCheckThread.join();

    close(clientSocket);
    return 0;
}