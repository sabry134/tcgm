using System;
using System.Collections.Generic;
using Entities;
using CardContainers;

namespace Engine {

    public class GameEngine {
        public Player Player { get; private set; }

        public List<(string, int)> startAttributes = new List<(string, int)>()
            { ("Health", 15), ("Mana", 10) };

        public GameEngine() {
            Player = new Player(new Deck(0, 20, new List<Card>()), 5, 5, startAttributes);
        }
    }
}
