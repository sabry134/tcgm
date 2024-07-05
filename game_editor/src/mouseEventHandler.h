#pragma once
#include "tcgmpch.h"
#include "card.hpp"
#include "Application.h"

void mouse_button_callback(GLFWwindow *window, int button, int action, int mods);
bool isInCard(std::vector<cardGraphique> cards, double xpos, double ypos);