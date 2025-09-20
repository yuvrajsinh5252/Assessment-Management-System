import { httpClient } from './httpClient.js';

export async function signup(payload) {
  const { data } = await httpClient.post('/auth/signup', payload);
  return data;
}

export async function login(payload) {
  const { data } = await httpClient.post('/auth/login', payload);
  return data;
}
