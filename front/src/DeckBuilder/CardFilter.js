import React, { useState, useEffect } from 'react';

const CardFilter = ({ cards, onFilter }) => {
  const [filter, setFilter] = useState({
    name: '',
    manaCost: '',
    type: '',
    rarity: ''
  });

  const possibleTypes = ['Spell', 'Creature', 'Caster']; // Example types
  const possibleRarities = ['Common', 'Rare', 'Epic', 'Legendary']; // Example rarities
  const possibleManaCosts = [...new Set(cards.map(card => card.manaCost))].sort((a, b) => a - b);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => {
      const updatedFilter = { ...prev, [name]: value };
      return updatedFilter;
    });
  };

  useEffect(() => {
    const filteredCards = cards.filter((card) => {
      const matchesName = filter.name ? card.name.toLowerCase().includes(filter.name.toLowerCase()) : true;
      const matchesManaCost = filter.manaCost ? card.manaCost == filter.manaCost : true;
      const matchesType = filter.type ? card.type === filter.type : true;
      const matchesRarity = filter.rarity ? card.rarity === filter.rarity : true;

      return matchesName && matchesManaCost && matchesType && matchesRarity;
    });
    onFilter(filteredCards);
  }, [filter, cards, onFilter]);

  return (
    <div className="card-filter">
      <input
        type="text"
        name="name"
        placeholder="Search by name"
        value={filter.name}
        onChange={handleChange}
      />
      <select name="manaCost" value={filter.manaCost} onChange={handleChange}>
        <option value="">All Mana Costs</option>
        {possibleManaCosts.map((cost) => (
          <option key={cost} value={cost}>{cost}</option>
        ))}
      </select>
      <select name="type" value={filter.type} onChange={handleChange}>
        <option value="">All Types</option>
        {possibleTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      <select name="rarity" value={filter.rarity} onChange={handleChange}>
        <option value="">All Rarities</option>
        {possibleRarities.map((rarity) => (
          <option key={rarity} value={rarity}>{rarity}</option>
        ))}
      </select>
    </div>
  );
};

export default CardFilter;
