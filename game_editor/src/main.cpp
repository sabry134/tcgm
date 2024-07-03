
// Include standard headers
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <GLFW/glfw3.h>

// Include GLEW
// #include <GL/glew.h>

// // Include GLFW
// #include <GLFW/glfw3.h>
// GLFWwindow* window;

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

	glfwMakeContextCurrent(window);

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
	while (!glfwWindowShouldClose(window)) {
		glfwPollEvents();
		glfwSwapBuffers(window);
	}
	{
		/* code */
	}
	
	glfwTerminate();
	return 0;

}