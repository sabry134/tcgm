import { baseRequest } from "./baseRequest";
import { getCardTypesPropertiesbyTypeRequest } from "./cardTypesPropertiesRequest";

export async function getCardRequest() {
  return await baseRequest('cards', 'GET', null, {});
}

// If no storedId or storedId is 0, create a new card
// Otherwise, update the card with the storedId
// data: {
//   "name": "string",
//   "text": "string",
//   "image: "string"
//   "properties": {},
//   "effect_ids": [
//     0
//   ],
//   "game_id": 0
//   "card_type_id": 0
// }

function adddMutablePropertiesFromProperties(typeProperties) {
  let tmpProperties = typeProperties.filter((value, index) => value.mutable);
  return tmpProperties.map((value, index) => {
    console.log(value);
    return {
      "name": value.property_name,
      "value_string": typeof value.value === "string" ? value.value : null,
      "value_number": typeof value.value === "number" ? value.value : null,
      "value_boolean": typeof value.value === "boolean" ? value.value : null,
      "cardtype_property_id": value.id
    };
  });
}

export async function saveCardRequest(storedId, game_id, data) {
  data.game_id = game_id;
  await getCardTypesPropertiesbyTypeRequest(data.card_type_id).then((properties) => {
    if (!storedId || storedId === "0") {
      delete data["properties"]
      return baseRequest('cards/with_properties', 'POST', {
        "card": data,
        "properties": adddMutablePropertiesFromProperties(properties),
      }, {
        'Content-Type': 'application/json'
      });
    } else {
      baseRequest('/cardProperties/card/' + storedId, 'GET').then((response) => {
        const reversedResponse = [...response].reverse();

        reversedResponse.forEach((element, index) => {
          const size = data.properties.length - 1
          baseRequest('cardProperties/' + element.id, 'PUT', {
            "cardProperty": {
              ...element,
              value_string: typeof data.properties[size - index].value === "string" ? data.properties[size - index].value : null,
              value_number: typeof data.properties[size - index].value === "number" ? data.properties[size - index].value : null,
              value_boolean: typeof data.properties[size - index].value === "boolean" ? data.properties[size - index].value : null,
            }
          }, {
            'Content-Type': 'application/json'
          });
        });
      })

      return baseRequest('cards/' + storedId, 'PUT', {
        "card": data
      }, {
        'Content-Type': 'application/json'
      });
    }
  })


}

export async function getCardsByGameRequest(gameId) {
  return await baseRequest(`cards/game/${gameId}`, 'GET');
}

export async function getCardByIdRequest(id) {
  return await baseRequest(`cards/${id}`, 'GET');
}

export async function getCardsByGameWithPropertiesRequest(gameId) {
  return await baseRequest(`cards/game/${gameId}/with_properties`, 'GET');
}

export async function getCardCardType(cardId) {
  return await baseRequest(`cards/${cardId}/cardtype`, 'GET');
}
