import BigNumber from 'bignumber.js';
import * as uuidParse from 'uuid-parse';
import * as QRCode from 'qrcode';
import * as bech32 from 'bech32';
import Long from 'long';
import { v4 } from 'uuid';
import base64url from 'base64url';

import { getUserInfo, getLikePayTxsByTxId } from './util/api';
import { COSMOS_DENOM } from './constant';
import { timeout } from './util/misc';
import { LikePayId } from './schema/pay-id';

export async function getTx(txId: string) {
  const [tx] = await getLikePayTxsByTxId(txId);
  return tx;
}

export function encodePayId({
  uuid,
  address,
  amount,
}: {
  uuid: string;
  address: string;
  amount: string;
}): string {
  const message = LikePayId.create({
    uuid: uuidParse.parse(uuid),
    address: Buffer.from(bech32.fromWords(bech32.decode(address).words)),
    amount: Long.fromString(amount, true, 10),
  });
  const buffer = LikePayId.encode(message).finish();
  return base64url(Buffer.from(buffer));
}

export async function pollForTxComplete(
  { id }: { id: string },
  { waitForSuccess = true }: { waitForSuccess: boolean } = { waitForSuccess: true },
) {
  let txData;
  let isDone = !waitForSuccess;
  while (!(txData && isDone)) {
  /* eslint-disable no-await-in-loop */
    try {
      txData = await getTx(id);
    } catch (err) {
      if (err?.response?.status !== 404) throw err;
    }
    if (txData && waitForSuccess) {
      if (txData.status === 'fail') throw new Error('TX_FAILED');
      isDone = txData.status === 'success';
    }
    await timeout(5000);
    /* eslint-enable no-await-in-loop */
  }
  return txData;
}

export async function waitForPayment({ selector, id }: { selector: string; id: string }) {
  const container = document.querySelector(selector) as HTMLElement;
  const txId = id || container.getAttribute('data-likepay-id');
  try {
    await pollForTxComplete({ id: txId }, { waitForSuccess: false });
    container.innerHTML = 'Waiting Tx to confirm...';
    const txData = await pollForTxComplete({ id: txId }, { waitForSuccess: true });
    container.innerHTML = 'Done!';
    return { id: txId, tx: txData, selector };
  } catch (err) {
    if (err.message === 'TX_FAILED') {
      container.innerHTML = 'Payment failed, please try again!';
    } else {
      console.error(err);
      container.innerHTML = `Unknown error: ${err}`;
    }
    throw err;
  }
}

function drawAvatarInQRCode(canvas: HTMLCanvasElement, avatarSrc: string) {
  const context = canvas.getContext('2d');
  const image = new Image();
  image.onload = (): void => {
    const imageWidth = canvas.width / 5;
    const imageHeight = canvas.height / 5;
    const canvasWidthCenter = canvas.width / 2;
    const canvasHeightCenter = canvas.height / 2;
    context.save();
    context.arc(canvasWidthCenter, canvasHeightCenter, imageWidth / 2, 0, Math.PI * 2);
    context.clip();
    context.drawImage(
      image,
      canvasWidthCenter - imageWidth / 2,
      canvasHeightCenter - imageHeight / 2,
      imageWidth,
      imageHeight,
    );
    context.restore();
  };
  image.src = avatarSrc;
}

export async function createPaymentQRCode(
  selector: string,
  likerId: string,
  amount: number,
  { blocking = true } = {},
) {
  const container = document.querySelector(selector) as HTMLElement;
  const user = await getUserInfo(likerId);
  if (!user) container.innerHTML = 'User not found';
  const { cosmosWallet, avatar } = user;
  if (!cosmosWallet) container.innerHTML = 'cosmosWallet not found';
  const coins = {
    denom: COSMOS_DENOM,
    amount: new BigNumber(amount).multipliedBy(1e9).toFixed(),
  };
  const uuid = v4();
  const payload = JSON.stringify({
    address: cosmosWallet,
    coins,
    memo: uuid,
  });
  const canvas = document.createElement('canvas');
  container.appendChild(canvas);
  await QRCode.toCanvas(canvas, payload, {
    errorCorrectionLevel: 'H',
    color: { dark: '#28646e' },
  });
  try {
    if (avatar) drawAvatarInQRCode(canvas, avatar);
  } catch (err) {
    console.error(err);
  }
  const txId = encodePayId({
    address: cosmosWallet,
    amount: coins.amount,
    uuid,
  });
  container.setAttribute('data-likepay-id', txId);
  if (!blocking) return { id: txId, selector };
  const txData = await waitForPayment({ selector, id: txId });
  return { id: txId, tx: txData, selector };
}

export default {
  createPaymentQRCode,
  pollForTxComplete,
  getTx,
};
