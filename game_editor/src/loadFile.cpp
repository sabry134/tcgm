#include <vector>
#include <iostream>
#include <fstream>
#include <string>
#include "card.hpp"

position getPosByLine(std::string ligne) {
    position p;
    size_t debut = ligne.find("x = ") + 3;
    if (debut == std::string::npos) {
        return p;
    }
    size_t fin = ligne.find(",", debut);
    if (fin == std::string::npos) {
        return p;
    }
    size_t longueur = fin - debut - 1;
    std::string sousChaine = ligne.substr(debut + 1, longueur);
    p.x = std::stof(sousChaine);
    debut = fin = ligne.find("y = ") + 3;
    if (debut == std::string::npos) {
        return p;
    }
    fin = ligne.find(";", debut);
    if (fin == std::string::npos) {
        return p;
    }
    longueur = fin - debut - 1;
    sousChaine = ligne.substr(debut + 1, longueur);
    p.y = std::stof(sousChaine);
    return p;
}

Size getSizeByLine(std::string ligne) {
    Size s;
    size_t debut = ligne.find("width = ") + 7;
    if (debut == std::string::npos) {
        return s;
    }
    size_t fin = ligne.find(",", debut);
    if (fin == std::string::npos) {
        return s;
    }
    size_t longueur = fin - debut - 1;
    std::string sousChaine = ligne.substr(debut + 1, longueur);
    s.width = std::stof(sousChaine);
    debut = fin = ligne.find("height = ") + 8;
    if (debut == std::string::npos) {
        return s;
    }
    fin = ligne.find(";", debut);
    if (fin == std::string::npos) {
        return s;
    }
    longueur = fin - debut - 1;
    sousChaine = ligne.substr(debut + 1, longueur);
    s.height = std::stof(sousChaine);
    return s;
}

std::vector<cardGraphique> generateCardGraphique(char *path) {
    std::cout << path << std::endl;
    std::vector<cardGraphique> cards;
    std::ifstream fichier(path);
    if (!fichier.is_open()) {
        std::cerr << "Erreur : Impossible d'ouvrir le fichier " << path << std::endl;
        return cards;
    }
    std::string ligne;
    while (std::getline(fichier, ligne)) {
        if (ligne.find("card") != std::string::npos) {
            std::getline(fichier, ligne);
            position p = getPosByLine(ligne);
            std::cout << ligne << std::endl;  // Affiche la ligne
            std::getline(fichier, ligne);
            Size s = getSizeByLine(ligne);
            std::cout << ligne << std::endl;  // Affiche la ligne
            cardGraphique c = cardGraphique(p.x, p.y, s.width, s.height);
            cards.push_back(c);
        }
        // Vous pouvez également traiter la ligne ici selon vos besoins
    }
    fichier.close();
    return cards;
}