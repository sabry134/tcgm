#include "card.hpp"
#include <SOIL/SOIL.h>

cardGraphique::cardGraphique(float x, float y, float width, float height) {
    pos.x = x;
    pos.y = y;
    size.width = width;
    size.height = height;
}

position cardGraphique::get_pos() {
    return pos;
};

Size cardGraphique::get_size() {
    return size;
};

void cardGraphique::setTextures(const char* path) {
    textureID = SOIL_load_OGL_texture(
        path,
        SOIL_LOAD_AUTO,
        SOIL_CREATE_NEW_ID,
        SOIL_FLAG_INVERT_Y
    );
    if (textureID == 0) {
        std::cerr << "Failed to load texture 1." << std::endl;
        textureID = 0;
    }
};

GLuint cardGraphique::getTexture() {
    return textureID;  
}