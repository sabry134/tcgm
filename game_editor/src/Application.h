#pragma once
#include "card.hpp"

extern std::vector<cardGraphique> cardsList;
extern int selectedCard;
namespace TCGM
{

    class Application
    {
    public:
        Application();
        virtual ~Application();

        void Run();
    };

    // To be defined in CLIENT
    Application *CreateApplication();

}