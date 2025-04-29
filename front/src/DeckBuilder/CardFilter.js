import React, { useState, useEffect } from 'react';
import { getCardTypesByGameRequest } from '../Api/cardTypesRequest';
import { getCardTypesPropertiesbyTypeRequest } from '../Api/cardTypesPropertiesRequest';

const CardFilter = ({ cards, onFilter }) => {
  const [filter, setFilter] = useState({
    name: '',
    selectedProperty: '',
    propertyValue: '',
    cardType: ''
  });

  const [possibleProperties, setPossibleProperties] = useState([]);
  const [possibleCardTypes, setPossibleCardTypes] = useState([]);
  const [selectedPropertyType, setSelectedPropertyType] = useState('text');

  useEffect(() => {
    async function fetchPossiblePropertiesAndTypes() {
      try {
        const gameId = localStorage.getItem('gameSelected');
        const types = await getCardTypesByGameRequest(gameId);

        const properties = [];
        for (const type of types) {
          const typeProperties = await getCardTypesPropertiesbyTypeRequest(type.id);
          properties.push(...typeProperties);
        }

        setPossibleProperties(properties);
        setPossibleCardTypes(types);
      } catch (error) {
        console.error('Error fetching possible properties or card types:', error);
        setPossibleProperties([]);
        setPossibleCardTypes([]);
      }
    }

    fetchPossiblePropertiesAndTypes();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'selectedProperty') {
      const selectedProperty = possibleProperties.find(
        (property) => property.property_name === value
      );
      setSelectedPropertyType(selectedProperty ? selectedProperty.type : 'text');
    }

    setFilter((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const filteredCards = cards.filter((card) => {
      const matchesName = filter.name ? card.name.toLowerCase().includes(filter.name.toLowerCase()) : true;
      const matchesCardType = filter.cardType ? card.card_type_id === Number(filter.cardType) : true;
      const matchesProperty =
        filter.selectedProperty && filter.propertyValue
          ? card.properties.some((prop) => {
              if (prop.name !== filter.selectedProperty) return false;

              if (selectedPropertyType === 'boolean') {
                return String(prop.value).toLowerCase() === filter.propertyValue.toLowerCase();
              }

              if (selectedPropertyType === 'number') {
                return Number(prop.value) === Number(filter.propertyValue);
              }

              return String(prop.value).toLowerCase().includes(filter.propertyValue.toLowerCase());
            })
          : true;

      return matchesName && matchesCardType && matchesProperty;
    });
    onFilter(filteredCards);
  }, [filter, cards, onFilter, selectedPropertyType]);

  return (
    <div className="card-filter">
      <input
        type="text"
        name="name"
        placeholder="Search by name"
        value={filter.name}
        onChange={handleChange}
      />
      <select
        name="cardType"
        value={filter.cardType}
        onChange={handleChange}
      >
        <option value="">Select a card type</option>
        {possibleCardTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
          </option>
        ))}
      </select>
      <select
        name="selectedProperty"
        value={filter.selectedProperty}
        onChange={handleChange}
      >
        <option value="">Select a property</option>
        {possibleProperties.map((property) => (
          <option key={property.property_name} value={property.property_name}>
            {property.property_name.charAt(0).toUpperCase() + property.property_name.slice(1)}
          </option>
        ))}
      </select>
      {selectedPropertyType === 'boolean' ? (
        <select
          name="propertyValue"
          value={filter.propertyValue}
          onChange={handleChange}
          disabled={!filter.selectedProperty}
        >
          <option value="">Select a value</option>
          <option value="true">True</option>
          <option value="false">False</option>
        </select>
      ) : (
        <input
          type={selectedPropertyType === 'number' ? 'number' : 'text'}
          name="propertyValue"
          placeholder={`Enter ${selectedPropertyType} value`}
          value={filter.propertyValue}
          onChange={handleChange}
          disabled={!filter.selectedProperty}
        />
      )}
    </div>
  );
};

export default CardFilter;