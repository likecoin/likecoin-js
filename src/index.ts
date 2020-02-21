import BigNumber from 'bignumber.js';
import { v4 } from 'uuid';
import * as QRCode from 'qrcode';

import { getUserInfo, getLikePayTxsByTxId } from './util/api';
import { COSMOS_DENOM } from './constant';
import { timeout } from './util/misc';

export async function getTx(txId: string) {
  const [tx] = await getLikePayTxsByTxId(txId);
  return tx;
}

export async function pollForTxComplete(txId: string) {
  let txData;
  while (!txData) {
  /* eslint-disable no-await-in-loop */
    try {
      txData = await getTx(txId);
    } catch (err) {
      if (err?.response?.status !== 404) throw err;
      await timeout(5000);
    }
    /* eslint-enable no-await-in-loop */
  }
  return txData;
}

export async function createPaymentQRCode(
  selector: string,
  likerId: string,
  amount: number,
  { blocking = true } = {},
) {
  const user = await getUserInfo(likerId);
  const { cosomosWallet } = user;
  const cosmosAmount = {
    denom: COSMOS_DENOM,
    amount: new BigNumber(amount).multipliedBy(1e9).toFixed(),
  };
  const uuid = v4();
  const payload = JSON.stringify({
    wallet: cosomosWallet,
    amount: cosmosAmount,
    memo: uuid,
  });
  await QRCode.toCanvas(document.querySelector(selector), payload);
  const txId = uuid; // TODO: encode with base64/protobuf?
  if (!blocking) return { id: txId };
  const txData = await pollForTxComplete(txId);
  return { id: txId, ...txData };
}

export default {
  createPaymentQRCode,
  pollForTxComplete,
  getTx,
};
