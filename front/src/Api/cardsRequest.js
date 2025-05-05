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
export async function saveCardRequest(storedId, game_id, data) {
  data.game_id = game_id;
  await getCardTypesPropertiesbyTypeRequest(data.card_type_id).then((properties) => {
    if (!storedId || storedId === "0") {
      return baseRequest('cards/with_properties', 'POST', {
        "card": data,
        "properties": properties,
      }, {
        'Content-Type': 'application/json'
      });
    } else {
      return baseRequest('cards/' + storedId, 'PUT', {
        "card": {
          ...data,
          properties: properties
        }
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
