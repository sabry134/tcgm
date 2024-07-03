cmake_minimum_required(VERSION 3.0.0)
project(TCGM)

add_executable(tcgm src/main.cpp)

target_link_libraries(tcgm glfw)