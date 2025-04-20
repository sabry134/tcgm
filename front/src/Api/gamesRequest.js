import { baseRequest } from "./baseRequest";

export async function getGamesRequest() {
  return await baseRequest('games', 'GET');
}

// game: {
//   "name": "string",
//   "description": "string"
// }
export async function createGameRequest(data) {
  return await baseRequest('games', 'POST', data, {
    'Content-Type': 'application/json'
  });
}

export async function getGameRequest(id) {
  return await baseRequest(`games/${id}`, 'GET');
}

// Update a game by id
// data: {
//   "name": "string",
//   "description": "string"
// }
export async function updateGameRequest(id, data) {
  return await baseRequest(`games/${id}`, 'PUT', data, {
    'Content-Type': 'application/json'
  });
}

// Get game by name
export async function getGameByNameRequest(name) {
  return await baseRequest(`games/${name}`, 'GET');
}

// Get list of card collection groups of a certain type in a game
export async function getGroupsForCollectionType(id, type) {
  return await baseRequest(`games/${id}/groups/${type}`, 'GET');
}