#include "mouseEventHandler.h"

void mouse_button_callback(GLFWwindow *window, int button, int action, int mods)
{
    int width, height;
    // Get the window size
    glfwGetWindowSize(window, &width, &height);
    double xpos, ypos;
    glfwGetCursorPos(window, &xpos, &ypos);
    if (button == GLFW_MOUSE_BUTTON_LEFT && action == GLFW_PRESS && isInCard(cardsList, ((xpos - (width / 2)) / (width / 2)), ((-ypos + (height / 2)) / (height / 2))))
        std::cout << "pressed here" << xpos << "   " << ypos << std::endl;
}

bool isInCard(std::vector<cardGraphique> cards, double xpos, double ypos)
{
    for (int i = 0; i < cards.size(); i++)
    {
        double x = cards[i].get_pos().x;
        double y = cards[i].get_pos().y;
        double sizeW = cards[i].get_size().width;
        double sizeH = cards[i].get_size().height;
        std::cout << x << " " << y << " " << sizeW << " " << sizeH << "   " << xpos << " " << ypos << std ::endl;

        if (xpos > x && xpos < x + sizeW && ypos > y && ypos < y + sizeH)
        {
            if (selectedCard != -1)
                selectedCard = -1;
            selectedCard = i;
            return true;
        }
    }
    selectedCard = -1;
    return false;
};