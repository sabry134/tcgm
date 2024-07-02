#include <SFML/Graphics.hpp>
#include <vector>
#include <iostream>

const int SHAPE_SPACING = 150;

void open_window(std::vector<int>& clientSockets) {
    sf::RenderWindow window(sf::VideoMode(1920, 1080), "TCGM Client");

    sf::Texture backgroundTexture;
    if (!backgroundTexture.loadFromFile("img/runner_background.jpg")) {
        std::cerr << "Error loading background texture." << std::endl;
        exit(1);
    }

    sf::Texture persoTexture;
    if (!persoTexture.loadFromFile("img/character.png")) {
        std::cerr << "Error loading perso texture." << std::endl;
        exit(1);
    }

    sf::Sprite backgroundSprite(backgroundTexture);

    std::vector<sf::Sprite> clientSprites;

    while (window.isOpen()) {
        sf::Event event;
        while (window.pollEvent(event)) {
            if (event.type == sf::Event::Closed) {
                window.close();
                std::cout << "Window has been closed!" << std::endl;
                exit(0);
            } else if (event.type == sf::Event::Resized) {
                sf::FloatRect visibleArea(0.f, 0.f, static_cast<float>(event.size.width), static_cast<float>(event.size.height));
                window.setView(sf::View(visibleArea));
            }
        }

        window.clear();

        window.draw(backgroundSprite);

        while (clientSprites.size() < clientSockets.size()) {
            sf::Sprite clientSprite(persoTexture);
            clientSprites.push_back(clientSprite);
        }

        while (clientSprites.size() > clientSockets.size()) {
            clientSprites.pop_back();
        }

        for (std::size_t i = 0; i < clientSprites.size(); ++i) {
            float x = 100.0f + i * SHAPE_SPACING;
            float y = 900.0f;

            clientSprites[i].setPosition(x, y);
            window.draw(clientSprites[i]);
        }

        window.display();
    }
}
