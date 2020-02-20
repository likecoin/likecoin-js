import BigNumber from 'bignumber.js';
import { v4 } from 'uuid';
import * as QRCode from 'qrcode';

import { getUserInfo } from './util/api';
import { COSMOS_DENOM } from './constant';

export async function createPaymentQRCode(selector: string, likerId: string, amount: number) {
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
  return uuid;
}

export default {
  createPaymentQRCode,
};
