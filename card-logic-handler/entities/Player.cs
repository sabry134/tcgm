using CardContainers;

namespace Entities {
    public class Player : Entity {

        public Deck Deck { get; private set; }
        public Hand Hand { get; set; }
        public Field Field { get; set; }
        public CardContainer Discard { get; set; }

        public Player(Deck deck, int maxHandSize, int maxBoardSize, List<(string, int)> startAttributes) {
            Deck = deck;
            Hand = new Hand(0, maxHandSize, new List<Card>());
            Field = new Field(0, maxHandSize, new List<Card>());
            Discard = new CardContainer(0, maxHandSize, new List<Card>());
            foreach (var (name, value) in startAttributes) {
                this.SetAttribute(name, value);
            }
        }

        public void DrawCard() {
            Deck.DrawCard(this);
        }
    }
}