import { baseRequest } from "./baseRequest";

export async function createGameRequest(data) {
  return await baseRequest('games', 'POST', data, {
    'Content-Type': 'application/json'
  });
}