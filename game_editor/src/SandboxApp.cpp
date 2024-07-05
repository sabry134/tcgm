#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <vector>
#include "TCGM.h"

// Include GLEW
#include <GL/glew.h>

// Include GLFW
#include <GLFW/glfw3.h>
// GLFWwindow* window;
#include <SOIL/SOIL.h>

#include "card.hpp"

class Sandbox : public TCGM::Application
{
public:
    Sandbox()
    {
    }

    ~Sandbox()
    {
    }
};

TCGM::Application *TCGM::CreateApplication()
{
    return new Sandbox();
}