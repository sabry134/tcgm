using Entities;

namespace CardContainers {

    public class Field : CardContainer {
        public Field(int minSize, int maxSize, List<Card> cards)
            : base(minSize, maxSize, cards) {}
    }

}