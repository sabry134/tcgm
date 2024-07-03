using System.Collections.Generic;
using System.Linq;
using Entities;

namespace CardContainers {

    public class Deck : CardContainer {

        public Deck(int minSize, int maxSize, List<Card> cards)
            : base(minSize, maxSize, cards) {}

        public void DrawCard(Player player) {
            if (Cards.Count() > 0) {
                Card card = Cards.First();
                Cards.RemoveAt(0);
                player.Hand.AddCard(card);
            } else {
                Console.WriteLine("No more cards in deck");
            }
        }

        public void Shuffle(Player player) {
            if (Cards.Count() > 1) {
                Cards = Cards.OrderBy(_ => Random.Shared.Next()).ToList();
            }
        }

    }

}