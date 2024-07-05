#include "tcgmpch.h"
#include "Application.h"

extern TCGM::Application *TCGM::CreateApplication();

int main(int argc, char **argv)
{
    TCGM::Application *app = TCGM::CreateApplication();
    app->Run();
    delete app;
}