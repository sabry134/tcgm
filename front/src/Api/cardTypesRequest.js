import { baseRequest } from "./baseRequest";

// Get all card types
export async function getCardTypesRequest() {
  return await baseRequest('cardTypes', 'GET');
}

// Create a new card type
// Data: {
//   "name": "string",
//   "properties": {},
//   "game_id": 0
// }
export async function createCardTypeRequest(data) {
  return await baseRequest('cardTypes', 'POST', data, {
    'Content-Type': 'application/json'
  });
}

// Get a card type by game id
export async function getCardTypesByGameRequest(gameId) {
  return await baseRequest(`cardTypes/game/${gameId}`, 'GET');
}


// Get a card type by id
export async function getCardTypeRequest(id) {
  return await baseRequest(`cardTypes/${id}`, 'GET');
}

// Update a card type by id
// Data: {
//   "name": "string",
//   "properties": {},
//   "game_id": 0
// }
export async function updateCardTypeRequest(id, data) {
  return await baseRequest(`cardTypes/${id}`, 'PUT', data, {
    'Content-Type': 'application/json'
  });
}