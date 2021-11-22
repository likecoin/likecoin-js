import axios from 'axios';

const { IS_TESTNET } = process?.env;

const LIKE_CO_API_HOST = `https://api${IS_TESTNET ? '.rinkeby' : ''}.like.co`;

const api = axios.create({
  baseURL: LIKE_CO_API_HOST,
  timeout: 10000,
});

export async function getUserInfo(userId: string) {
  const { data } = await api.get(`/users/id/${userId}/min`);
  return data;
}

export async function getLikePayTxsByTxId(txId: string) {
  const { data } = await api.get(`/tx/likepay/${txId}`);
  return data;
}
