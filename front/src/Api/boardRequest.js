import { baseRequest } from './baseRequest';

export async function getBoardByGameIdRequest(gameId) {
  return await baseRequest(`boards/games/${gameId}`, 'GET');
}