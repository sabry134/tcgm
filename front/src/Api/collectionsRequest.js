import { baseRequest } from "./baseRequest";

// Get collection with id
export async function getCollectionRequest(id) {
    return await baseRequest(`card_collections/${id}`, 'GET');
}

// Create a new collection
// Data: {
//   "name": "string",
//   "quantity": 0,
//   "game_id": 0,
//   "user_id": 0, (optional)
//   "type": "string"
// }
export async function createCollectionRequest(data) {
    return await baseRequest('card_collections', 'POST', data, {
        'Content-Type': 'application/json'
    });
}

// Update a collection by id
// Data: {
//   "name": "string",
//   "quantity": 0,
//   "game_id": 0,
//   "user_id": 0, (optional)
//   "type": "string"
// }
export async function updateCollectionRequest(id, data) {
    return await baseRequest(`card_collections/${id}`, 'PUT', data, {
        'Content-Type': 'application/json'
    });
}

// delete a collection by id
export async function deleteCollectionRequest(id) {
    return await baseRequest(`card_collections/${id}`, 'DELETE');
}

// Get card collection by game id
export async function getCollectionsByGameRequest(gameId) {
    return await baseRequest(`card_collections/game/${gameId}`, 'GET');
}

// Get card collection by game id and type
export async function getCollectionsByGameAndTypeRequest(gameId, type) {
    return await baseRequest(`card_collections/game/${gameId}/type/${type}`, 'GET');
}

// Get card collection by user id
export async function getCollectionsByUserRequest(userId) {
    return await baseRequest(`card_collections/user/${userId}`, 'GET');
}

// Get card collection by user id and game id
export async function getCollectionsByUserAndGameRequest(userId, gameId) {
    return await baseRequest(`card_collections/user/${userId}/game/${gameId}`, 'GET');
}

// Add a card to a collection
export async function addCardToCollectionRequest(collectionId, cardId, quantity) {
    return await baseRequest(`card_collections/add_card/${collectionId}/card/${cardId}/quantity/${quantity}`, 'POST');
}

// Remove a card from a collection
export async function removeCardFromCollectionRequest(collectionId, cardId, quantity) {
    return await baseRequest(`card_collections/remove_card/${collectionId}/card/${cardId}/quantity/${quantity}`, 'POST');
}

// List all cards in a collection
export async function listCardsInCollectionRequest(collectionId) {
    return await baseRequest(`card_collections/get_cards/${collectionId}`, 'GET');
}