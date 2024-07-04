#include "json/json.h"
#include <iostream>
#include <string>

std::string InitialJsonFromString() {
    std::string json = R"(
        {
            "name": "Card",
            "health": 30,
        }
    )";

    Json::CharReaderBuilder builder;
    Json::CharReader* reader = builder.newCharReader();
    Json::Value root;
    std::string errors;

    if (!reader->parse(json.c_str(), json.c_str() + json.size(), &root, &errors)) {
        std::cerr << "Failed to parse JSON: " << errors << std::endl;
        return "";
    }

    std::string name = root["name"].asString();
    int health = root["health"].asInt();

    return name + " has " + std::to_string(health) + " health.";
}
