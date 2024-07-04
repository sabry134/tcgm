#version 330 core
in vec2 UV;
out vec4 color;

uniform sampler2D myTextureSampler;
uniform int useTexture;
uniform vec3 rectColor;

void main() {
    if (useTexture == 1) {
        color = texture(myTextureSampler, UV);
    } else {
        color = vec4(rectColor, 1.0);
    }
}
