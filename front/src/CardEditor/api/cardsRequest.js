import { baseRequest } from "./baseRequest";

export async function saveCardRequest(storedId, data) {
  if (!storedId || storedId === "0") {
    return await baseRequest('cards', 'POST', data, {
      'Content-Type': 'application/json'
    });
  } else {
    return await baseRequest('cards/' + storedId, 'PUT', data, {
      'Content-Type': 'application/json'
    });
  }
}

export async function getCardRequest() {
  return await baseRequest('cards', 'GET', null, {});
}