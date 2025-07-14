import { baseRequest } from "./baseRequest";

// Create a new card collection group
// data: {
//   "name": "string",
//   "game_id": "string",
//   "max_cards": "number",
//   "min_cards": "number",
//   "max_copies": "number",
//   "share_max_copies": "boolean",
//   "allowed_card_types": ["string"],
//   "collection_type": "string"
// }

export async function createCardCollectionGroupRequest(data) {
  return await baseRequest('card_collection_groups', 'POST', data, {
    'Content-Type': 'application/json'
  });
}

// Update a card collection group by id
// data: {
//   "name": "string",
//   "game_id": "string",
//   "max_cards": "number",
//   "min_cards": "number",
//   "max_copies": "number",
//   "share_max_copies": "boolean",
//   "allowed_card_types": ["string"],
//   "collection_type": "string"
// }

export async function updateCardCollectionGroupRequest(id, data) {
  return await baseRequest(`card_collection_groups/${id}`, 'PUT', data, {
    'Content-Type': 'application/json'
  });
}

export async function getCardCollectionGroupsForGameRequest(gameId) {
    return await baseRequest(`card_collection_groups/game/${gameId}`, 'GET');
}

export async function getCardCollectionGroupsForGameWithTypeRequest(gameId, type) {
    return await baseRequest(`card_collection_groups/game/${gameId}/type/${type}`, 'GET');
}

// Get a card collection group by id
export async function getCardCollectionGroupRequest(id) {
  return await baseRequest(`card_collection_groups/${id}`, 'GET');
}

// Get card collection group types
export async function getCardCollectionGroupTypesRequest() {
  return await baseRequest('card_collection_groups/card_collection_types', 'GET');
}

export async function deleteCardCollectionGroupRequest(id) {
  return await baseRequest(`card_collection_groups/delete/${id}`, 'DELETE');
}
