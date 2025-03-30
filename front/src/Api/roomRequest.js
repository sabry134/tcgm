import { baseRequest } from "./baseRequest";

// Create a new room
export async function createRoomRequest() {
  return await baseRequest('rooms', 'POST', {
    'Content-Type': 'application/json'
  });
}

// Join a room
// data: {
//   "username": "string"
// }
export async function joinRoomRequest(roomId, data) {
  return await baseRequest(`rooms/${roomId}/join`, 'POST', data, {
    'Content-Type': 'application/json'
  });
}