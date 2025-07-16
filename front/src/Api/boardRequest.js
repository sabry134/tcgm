import { baseRequest } from './baseRequest';

export async function getBoardByGameIdRequest(gameId) {
  return await baseRequest(`boards/game/${gameId}`, 'GET');
}