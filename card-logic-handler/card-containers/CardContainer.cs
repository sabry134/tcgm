using System;
using System.Collections.Generic;
using Entities;

namespace CardContainers {
    public class CardContainer {
        protected List<Card> Cards = new List<Card>();
        protected int MinSize;
        protected int MaxSize;

        public CardContainer(int minSize, int maxSize, List<Card> cards) {
            MinSize = minSize;
            MaxSize = maxSize;
            Cards = cards;
        }

        public List<Card> GetCards() {
            return Cards;
        }

        public Card GetCard(int index) {
            if (index < Cards.Count()) {
                return Cards.ElementAt(index);
            } else {
                return null;
            }
        }

        public void AddCard(Card card) {
            Cards.Add(card);
        }

        public void RemoveCard(Card card) {
            Cards.Remove(card);
        }

        public int CountCards() {
            return Cards.Count();
        }
    }
}