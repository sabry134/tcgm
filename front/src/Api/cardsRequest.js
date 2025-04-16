import { baseRequest } from "./baseRequest";

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
  data.card.game_id = game_id;

  if (!storedId || storedId === "0") {
    return await baseRequest('cards', 'POST', data, {
      'Content-Type': 'application/json'
    });
  } else {
    return await baseRequest('cards/' + storedId, 'PUT', data, {
      'Content-Type': 'application/json'
    });
  }
}

export async function getCardsByGameRequest(gameId) {
  return await baseRequest(`cards/game/${gameId}`, 'GET');
}

export async function getCardByIdRequest(id) {
  return await baseRequest(`cards/${id}`, 'GET');
}
