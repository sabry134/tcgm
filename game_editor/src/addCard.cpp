  
#include <stdio.h>
#include <stdlib.h>
#include <iostream>
#include <vector>
#include <GL/glew.h>
#include "card.hpp"

void createRectangleVertexData(cardGraphique rect, std::vector<GLfloat>& vertexData, std::vector<GLfloat>& uvData) {
    vertexData = {
        rect.get_pos().x, rect.get_pos().y, 0.0f, // Bottom left
        rect.get_pos().x + rect.get_size().width, rect.get_pos().y, 0.0f, // Bottom right
        rect.get_pos().x, rect.get_pos().y + rect.get_size().height, 0.0f, // Top left
        rect.get_pos().x + rect.get_size().width, rect.get_pos().y + rect.get_size().height, 0.0f  // Top right
    };
    uvData = {
        0.0f, 0.0f, // Bottom left
        1.0f, 0.0f, // Bottom right
        0.0f, 1.0f, // Top left
        1.0f, 1.0f  // Top right
    };
}

void addCard(std::vector<cardGraphique>& cards, GLuint vertexbuffer, GLuint uvbuffer, GLint useTextureLocation, GLint rectColorLocation, std::vector<GLfloat> vertexData, std::vector<GLfloat> uvData) {
    for (auto& card : cards) {
        createRectangleVertexData(card, vertexData, uvData);

        // Bind vertex buffer and update data
        glBindBuffer(GL_ARRAY_BUFFER, vertexbuffer);
        glBufferData(GL_ARRAY_BUFFER, vertexData.size() * sizeof(GLfloat), vertexData.data(), GL_STATIC_DRAW);
        glVertexAttribPointer(0, 3, GL_FLOAT, GL_FALSE, 0, (void*)0);

        // Bind UV buffer and update data
        glBindBuffer(GL_ARRAY_BUFFER, uvbuffer);
        glBufferData(GL_ARRAY_BUFFER, uvData.size() * sizeof(GLfloat), uvData.data(), GL_STATIC_DRAW);
        glVertexAttribPointer(1, 2, GL_FLOAT, GL_FALSE, 0, (void*)0);

        if (card.getTexture() != 0) {
            glUniform1i(useTextureLocation, 1);
            glActiveTexture(GL_TEXTURE0);
            glBindTexture(GL_TEXTURE_2D, card.getTexture());
        } else {
            glUniform1i(useTextureLocation, 0);
            // Set rectColorLocation with glUniform* if no texture is used
            float rectColor[] = { 1.0f, 0.0f, 0.0f }; // Rouge pur
            glUniform3fv(rectColorLocation, 1, rectColor);
        }

        glDrawArrays(GL_TRIANGLE_STRIP, 0, 4); // Draw a rectangle (4 vertices)

    }
    glDisableVertexAttribArray(0);
    glDisableVertexAttribArray(1);
}
