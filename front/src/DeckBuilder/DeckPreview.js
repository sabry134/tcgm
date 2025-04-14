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

  const totalMana = deck.normal.reduce((sum, card) => sum + card.manaCost, 0);
  const averageMana = deck.length > 0 ? (totalMana / deck.length).toFixed(2) : 0;

  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  return (
    <div className="deck-preview">
      <h3>Your Deck</h3>
      <div className="deck-cards">
        {groupCards(deck.normal).map(card => (
          <div
            key={card.id}
            className="deck-card"
            onMouseEnter={() => setHoveredCard(card)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => removeSingleCard(card)}
          >
            <img src={card.image} alt={card.name} />
            <h4>{card.name} x{card.count} - {card.manaCost}</h4>
          </div>
        ))}
        </div>
        <h3>Casters</h3>
      <div className="deck-casters">
        {groupCards(deck.casters).map(card => (
          <div
            key={card.id}
            className="deck-card"
            onMouseEnter={() => setHoveredCard(card)}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={() => removeSingleCard(card)}
          >
            <img src={card.image} alt={card.name} />
            <h4>{card.name} x{card.count}</h4>
          </div>
        ))}
      </div>
      <p>Total Cards: {deck.length}</p>
      <p>average Mana Cost: {averageMana} 🧪</p>

      {saveStatus && <p>{saveStatus}</p>}
    </div>
  );
};

export default DeckPreview;
