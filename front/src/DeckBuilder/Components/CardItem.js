import React from 'react';

const CardItem = ({ card, onCardClick }) => {
  return (
    <div className="card-item" onClick={() => onCardClick(card)}>
      <img src={card.image} alt={card.name} />
      <h3>{card.name}</h3>
    </div>
  );
};

export default CardItem;
