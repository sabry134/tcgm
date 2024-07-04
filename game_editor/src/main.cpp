// Include standard headers
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <vector>

// Include GLEW
#include <GL/glew.h>

// Include GLFW
#include <GLFW/glfw3.h>
// GLFWwindow* window;
#include <SOIL/SOIL.h>

#include "card.hpp"

// // Include GLM
// #include <glm/glm.hpp>
// using namespace glm;

// #include <common/shader.hpp>

int main( void )
{
	GLFWwindow* window;
	std::cout << "Hello" << std::endl;
    if( !glfwInit() )
	{
		fprintf( stderr, "Failed to initialize GLFW\n" );
		getchar();
		return -1;
	}

	// glfwWindowHint(GLFW_SAMPLES, 4);
	// glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
	// glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 3);
	// glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GL_TRUE); // To make macOS happy; should not be needed
	// glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);

	// // Open a window and create its OpenGL context
	window = glfwCreateWindow( 1024, 768, "Tutorial 01", NULL, NULL);
	if (!window) {
        fprintf(stderr, "Failed to open GLFW window\n");
        glfwTerminate();
        return -1;
    }

	glfwMakeContextCurrent(window);

    if (glewInit() != GLEW_OK) {
        fprintf(stderr, "Failed to initialize GLEW\n");
        glfwTerminate();
        return -1;
    }	
	// // Initialize GLEW
	// if (glewInit() != GLEW_OK) {
	// 	fprintf(stderr, "Failed to initialize GLEW\n");
	// 	getchar();
	// 	glfwTerminate();
	// 	return -1;
	// }

	// // Ensure we can capture the escape key being pressed below
	// glfwSetInputMode(window, GLFW_STICKY_KEYS, GL_TRUE);

	// // Dark blue background
	// glClearColor(0.0f, 0.0f, 0.4f, 0.0f);
	GLuint programID = LoadShaders("vertex_shader.glsl", "fragment_shader.glsl");
    glUseProgram(programID);
	GLuint VertexArrayID;
	glGenVertexArrays(1, &VertexArrayID);
	glBindVertexArray(VertexArrayID);
	std::vector<cardGraphique> cards = generateCardGraphique("/home/besnainou/epitech/EIP/EIP_TCGM/game_editor/src/config_card.txt");
	cards[1].setTextures("/home/besnainou/Downloads/unoCard.png");
	cards[0].setTextures("/home/besnainou/Downloads/yugiohCard.png");
    GLuint vertexbuffer, uvbuffer;

    glGenBuffers(1, &vertexbuffer);
    glGenBuffers(1, &uvbuffer);
	// do{
	// 	// Clear the screen. It's not mentioned before Tutorial 02, but it can cause flickering, so it's there nonetheless.
	// 	glClear( GL_COLOR_BUFFER_BIT );

	// 	// Draw nothing, see you in tutorial 2 !

		
	// 	// Swap buffers
	// 	glfwSwapBuffers(window);
	// 	glfwPollEvents();

	// } // Check if the ESC key was pressed or the window was closed
	// while( glfwGetKey(window, GLFW_KEY_ESCAPE ) != GLFW_PRESS &&
	// 	   glfwWindowShouldClose(window) == 0 );

	// // Close OpenGL window and terminate GLFW
    std::vector<GLfloat> vertexData;
    std::vector<GLfloat> uvData;
	GLint useTextureLocation = glGetUniformLocation(programID, "useTexture");
    GLint rectColorLocation = glGetUniformLocation(programID, "rectColor");
	GLuint backgroundTextureID = loadTexture("/home/besnainou/Downloads/fond_start.png");
	glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
	while (!glfwWindowShouldClose(window)) {
		glClear(GL_COLOR_BUFFER_BIT);
        glEnableVertexAttribArray(0);
        glEnableVertexAttribArray(1);
		//drawBackground(backgroundTextureID);
		addCard(cards, vertexbuffer, uvbuffer, useTextureLocation, rectColorLocation, vertexData, uvData);
		// Swap buffers
		glfwSwapBuffers(window);
		glfwPollEvents();
	}
	{
		/* code */
	}
	
	glfwTerminate();
	return 0;

}