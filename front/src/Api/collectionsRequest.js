import { baseRequest } from "./baseRequest";

export async function getCollectionsRequest() {
  return await baseRequest('card_collections', 'GET');
}

// Create a new collection
// data: {
//   "name": "string",
//   "properties": {},
//   "game_id": 0,
//   "type": "string",
//   "user_id": 0 (optional)
// }

export async function createCollectionRequest(data) {
    return await baseRequest('card_collections', 'POST', data, {
        'Content-Type': 'application/json'
    });
}

// Delete a collection by id

export async function deleteCollectionRequest(id) {
    return await baseRequest(`card_collections/delete/${id}`, 'DELETE');
}

// Get cards in a collection by id
export async function getCardsInCollectionRequest(id) {
    return await baseRequest(`card_collections/${id}/cards`, 'GET');
}

// Update a collection by id
// data: {
//   "cards": cards,
// }

export async function updateCollectionRequest(id, data) {
    return await baseRequest(`card_collections/${id}/cards`, 'PUT', data, {
        'Content-Type': 'application/json'
    });
}

// Get collection by user id

export async function getCollectionsByUserRequest(userId) {
    return await baseRequest(`card_collections/user/${userId}`, 'GET');
}

// Get collection by user id and game id

export async function getCollectionsByUserAndGameRequest(userId, gameId) {
    return await baseRequest(`card_collections/user/${userId}/game/${gameId}`, 'GET');
}

// Save collection with cards
// data: {
//   "cards": cards,
// }

export async function saveCollectionWithCardsRequest(id, cards) {
    return await baseRequest(`card_collections/${id}/cards`, 'PUT', cards, {
        'Content-Type': 'application/json'
    });
}

// Get list of cards in a card collection

export async function getCardsInCardCollection(id) {
    return await baseRequest(`card_collections/${id}/cards`, 'GET');
}

// Get list of groups in a card collection
export async function getGroupsInCardCollection(id) {
    return await baseRequest(`card_collections/${id}/groups`, 'GET');
}
