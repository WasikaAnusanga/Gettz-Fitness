import client from './client.js';

const LOGIN_ENDPOINTS = {
   admin: '/api/auth/admin/login',
   trainer: '/api/auth/trainer/login',
   equipmentManager: '/api/auth/equipment-manager/login',
   customerSupporter: '/api/auth/customer-supporter/login',
};

export async function login({ role, email, password }) {
  const path = LOGIN_ENDPOINTS[role];
  if (!path) throw new Error(`Unsupported role: ${role}`);

  const { data } = await client.post(path, { email, password });
  return data;
}
