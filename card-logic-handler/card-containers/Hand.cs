using Entities;

namespace CardContainers {

    public class Hand : CardContainer {
        public Hand(int minSize, int maxSize, List<Card> cards)
            : base(minSize, maxSize, cards) {}
        
        public void DiscardRandom(CardContainer target) {
            int count = Cards.Count();
            int rInt = 0;

            if (count == 0) {
                Console.WriteLine("No cards in hand");
            } else if (count == 1) {
                rInt = 1;
            } else {
                Random rng = new Random();
                rInt = rng.Next(0, Cards.Count() - 1);
            }

            Card card = Cards.ElementAt(rInt);
            Cards.RemoveAt(rInt);
            target.AddCard(card);
        }

        public void Discard(Card card, CardContainer target, int index) {
            if (index <= Cards.Count()) {
                card = Cards.ElementAt(index);
                Cards.RemoveAt(index);
                target.AddCard(card);
            }
        }
    }

}