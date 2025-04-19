import React, { useState } from 'react';

const DeckPreview = ({ deck, removeSingleCard, setHoveredCard }) => {

  const groupCards = (cards) => {
    const map = {};
    cards.forEach(card => {
      if (!map[card.id]) map[card.id] = { ...card, count: 0 };
      map[card.id].count++;
    });
    return Object.values(map);
  };

  return (
    <div className="deck-preview">
      <h3>Your Deck</h3>
      {Object.entries(deck).map(([category, cards]) => (
        <div key={category} className={`deck-category deck-${category}`}>
          <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
          <div className="deck-cards">
            {groupCards(cards).map((card) => (
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
      ))}
      <p>Total Cards: {deck.length}</p>
    </div>
  );
};

export default DeckPreview;
