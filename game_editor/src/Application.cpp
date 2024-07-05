#include "Application.h"

#include <iostream>
#include "tcgmpch.h"
#include "card.hpp"
#include "Events/MouseEvent.h"
#include "mouseEventHandler.h"

std::vector<cardGraphique> cardsList;
int selectedCard = -1;
namespace TCGM
{
    Application::Application()
    {
    }

    Application::~Application()
    {
    }

    void Application::Run()
    {

        GLFWwindow *window;
        if (!glfwInit())
        {
            fprintf(stderr, "Failed to initialize GLFW\n");
            getchar();
            return;
        }

        // // Open a window and create its OpenGL context
        window = glfwCreateWindow(1024, 768, "Tutorial 01", NULL, NULL);
        if (!window)
        {
            fprintf(stderr, "Failed to open GLFW window\n");
            glfwTerminate();
            return;
        }

        glfwMakeContextCurrent(window);

        if (glewInit() != GLEW_OK)
        {
            fprintf(stderr, "Failed to initialize GLEW\n");
            glfwTerminate();
            return;
        }

        // glClearColor(0.0f, 0.0f, 0.4f, 0.0f);
        GLuint programID = LoadShaders("vertex_shader.glsl", "fragment_shader.glsl");
        glUseProgram(programID);
        GLuint VertexArrayID;
        glGenVertexArrays(1, &VertexArrayID);
        glBindVertexArray(VertexArrayID);
        cardsList = generateCardGraphique("./src/config_card.txt");
        cardsList[3].setTextures("./assets/unoCard.png");
        cardsList[2].setTextures("./assets/unoCard.png");
        cardsList[1].setTextures("./assets/unoCard.png");
        cardsList[0].setTextures("./assets/yugiohCard.png");
        GLuint vertexbuffer, uvbuffer;

        glGenBuffers(1, &vertexbuffer);
        glGenBuffers(1, &uvbuffer);

        // // Close OpenGL window and terminate GLFW
        std::vector<GLfloat> vertexData;
        std::vector<GLfloat> uvData;
        GLint useTextureLocation = glGetUniformLocation(programID, "useTexture");
        GLint rectColorLocation = glGetUniformLocation(programID, "rectColor");
        GLuint backgroundTextureID = loadTexture("./assets/background.png");
        glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
        glfwSetMouseButtonCallback(window, mouse_button_callback);

        while (!glfwWindowShouldClose(window))
        {
            if (selectedCard != -1)
            {
                double xpos, ypos;
                int width, height;
                glfwGetWindowSize(window, &width, &height);
                glfwGetCursorPos(window, &xpos, &ypos);
                xpos = ((xpos - (width / 2)) / (width / 2));
                ypos = ((-ypos + (height / 2)) / (height / 2));
                position pos;
                pos.x = xpos;
                pos.y = ypos;
                cardsList[selectedCard].setPos(pos);
            }
            glClear(GL_COLOR_BUFFER_BIT);
            glEnableVertexAttribArray(0);
            glEnableVertexAttribArray(1);
            // drawBackground(backgroundTextureID);
            addCard(cardsList, vertexbuffer, uvbuffer, useTextureLocation, rectColorLocation, vertexData, uvData);
            // Swap buffers
            glfwSwapBuffers(window);
            glfwPollEvents();
        }

        glfwTerminate();
    }

}