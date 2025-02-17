import { baseRequest } from "./baseRequest";

// Login user
// data: {
//   "username": "string"
// }
export async function loginUserRequest(data) {
  return await baseRequest('login', 'POST', data, {
    'Content-Type': 'application/json'
  });
}

// Get all users
export async function getUsersRequest() {
  return await baseRequest('users', 'GET');
}

// Create a new user
// data: {
//   "username": "string"
// }
export async function createUserRequest(data) {
  return await baseRequest('users', 'POST', data, {
    'Content-Type': 'application/json'
  });
}

// Get a user by id
export async function getUserRequest(id) {
  return await baseRequest(`users/${id}`, 'GET');
}

// Update a user by id
// data: {
//   "username": "string"
// }
export async function updateUserRequest(id, data) {
  return await baseRequest(`users/${id}`, 'PUT', data, {
    'Content-Type': 'application/json'
  });
}