import { baseRequest } from "./baseRequest";

export async function getCardTypesRequest() {
  return await baseRequest('cardTypes', 'GET');
}

// Create a new card type
// data: {
//   "name": "string",
//   "properties": {},
//   "game_id": 0
// }
export async function createCardTypeRequest(data) {
  return await baseRequest('cardTypes', 'POST', data, {
    'Content-Type': 'application/json'
  });
}

export async function getCardTypesByGameRequest(gameId) {
  return await baseRequest(`cardTypes/game/${gameId}`, 'GET');
}


export async function getCardTypeRequest(id) {
  return await baseRequest(`cardTypes/${id}`, 'GET');
}

// Update a card type by id
// data: {
//   "name": "string",
//   "properties": {},
//   "game_id": 0
// }
export async function updateCardTypeRequest(id, data) {
  return await baseRequest(`cardTypes/${id}`, 'PUT', data, {
    'Content-Type': 'application/json'
  });
}

export async function getCardTypeTemplatesRequest() {
  return await baseRequest('cardTypes/templates', 'GET');
}