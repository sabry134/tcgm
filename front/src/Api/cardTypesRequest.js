import { baseRequest } from "./baseRequest";

export async function createCardTypeRequest(data) {
  return await baseRequest('cardTypes', 'POST', data, {
    'Content-Type': 'application/json'
  });
}