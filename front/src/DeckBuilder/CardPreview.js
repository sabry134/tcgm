import React from 'react';

const CardPreview = ({ card }) => {
  if (!card) {
    return (
      <div className="card-preview">
        <p>Hover over a card to preview.</p>
      </div>
    );
  }

  return (
    <div className="card-preview">
      <h2>{card.name}</h2>
      <img src={card.image} alt={card.name} className="card-preview-image" />
      <div className="card-properties">
        <p><strong>Mana Cost:</strong> {card.manaCost}</p>
        <p><strong>Type:</strong> {card.type}</p>
        <p><strong>Rarity:</strong> {card.rarity}</p>
        <p><strong>Description:</strong> {card.description}</p>
      </div>
    </div>
  );
};

export default CardPreview;
