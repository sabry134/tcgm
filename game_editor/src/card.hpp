#ifndef CARD_H
#define CARD_H
#include <iostream>
#include <string>
#include <vector>
#include <GL/glew.h>

struct position
{
    float x, y;
};

struct Size
{
    float width, height;
};

class cardGraphique
{
private:
    position pos; // Position of the rectangle
    Size size;    // Size of the rectangle
    GLuint textureID = 0;

public:
    cardGraphique(float px, float py, float width, float height);
    position get_pos();
    Size get_size();
    GLuint getTexture();
    void setPos(position pos);
    void setTextures(const char *path);
};

void addCard(std::vector<cardGraphique> &cards, GLuint vertexbuffer, GLuint uvbuffer, GLint useTextureLocation, GLint rectColorLocation, std::vector<GLfloat> vertexData, std::vector<GLfloat> uvData);
GLuint LoadShaders(const char *vertex_file_path, const char *fragment_file_path);
GLuint loadTexture(const char *path);
void drawBackground(GLuint textureID);
std::vector<cardGraphique> generateCardGraphique(char *path);

#endif