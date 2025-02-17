import { baseRequest } from "./baseRequest";

export async function createUserRequest(data) {
  return await baseRequest('users', 'POST', data, {
    'Content-Type': 'application/json'
  });
}