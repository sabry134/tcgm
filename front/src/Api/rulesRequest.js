import { baseRequest } from './baseRequest';

export async function getGamesRulesByGameIdRequest(gameId) {
  return await baseRequest(`gameRules/gameRule/${gameId}`, 'GET');
}

export async function getPlayerPropertiesByGameRuleIdRequest(gameRuleId) {
  return await baseRequest(`playerProperties/playerProperty/${gameRuleId}`, 'GET');
}
