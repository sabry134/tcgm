cmake_minimum_required(VERSION 3.0.0)
project(TCGM)

include_directories(/usr/local/include)

add_executable(tcgm src/main.cpp src/addCard.cpp src/card.cpp src/shaders.cpp src/background.cpp src/loadFile.cpp)

link_directories(/usr/local/lib)

target_link_libraries(tcgm SOIL GLEW GL glfw)