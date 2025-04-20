import React, { useState } from 'react';

const DeckPreview = ({ deck, removeSingleCard, setHoveredCard, deckGroups }) => {
  const groupCards = (cards) => {
    const map = {};
    cards.forEach((card) => {
      if (!map[card.id]) map[card.id] = { ...card, count: 0 };
      map[card.id].count++;
    });
    return Object.values(map);
  };

  return (
    <div className="deck-preview">
      <h3>Your Deck</h3>
      {deckGroups.map((group) => {
        const cardsInGroup = deck[group.name] || [];
        const totalCardsInGroup = cardsInGroup.length;

        return (
          <div key={group.name} className={`deck-category deck-${group.name}`}>
            <h3>{group.name.charAt(0).toUpperCase() + group.name.slice(1)}</h3>
            <p>
              Cards: {totalCardsInGroup} / {group.min_cards} (Min) - {group.max_cards} (Max)
            </p>
            <div className="deck-cards">
              {groupCards(cardsInGroup).map((card) => (
                <div
                  key={card.id}
                  className="deck-card"
                  onMouseEnter={() => setHoveredCard(card)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={() => removeSingleCard(card)}
                >
                  <img src={card.image} alt={card.name} />
                  <h4>
                    {card.name} x{card.count} {card.manaCost ? `- ${card.manaCost}` : ''}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      <p>
        Total Cards: {Object.values(deck).reduce((total, cards) => total + cards.length, 0)}
      </p>
    </div>
  );
};

export default DeckPreview;
