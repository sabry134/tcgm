import { baseRequest } from "./baseRequest";

// Create a new user
export async function createUserRequest(data) {
  return await baseRequest('users', 'POST', data, {
    'Content-Type': 'application/json'
  });
}