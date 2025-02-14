import { baseRequest } from "./baseRequest";

export async function loginRequest(data) {
  return await baseRequest('login', 'POST', data, {
    'Content-Type': 'application/json'
  });
}