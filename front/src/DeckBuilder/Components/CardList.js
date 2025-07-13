import React from 'react';

const CardList = ({ cards, addCardToDeck, setHoveredCard }) => {

  return (
    <div className="card-list">
      {cards.map((card) => (
        <div
          key={card.id}
          className="card-item"
          onMouseEnter={() => setHoveredCard(card)}
          onClick={() => addCardToDeck(card)}
        >
          <img src={card.image} alt={card.name} />
          <h4>{card.name}</h4>
        </div>
      ))}
    </div>
  );
};

export default CardList;
