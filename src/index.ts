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
import { LikePayId } from './schema/pay-id.js';

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
}) {
  const message = LikePayId.create({
    uuid: uuidParse.parse(uuid),
    address: Buffer.from(bech32.fromWords(bech32.decode(address).words)),
    amount: Long.fromString(amount, true, 10),
  });
  const buffer = LikePayId.encode(message).finish();
  return base64url(Buffer.from(buffer));
}

export async function pollForTxComplete(txId: string) {
  let txData;
  while (!txData) {
  /* eslint-disable no-await-in-loop */
    try {
      txData = await getTx(txId);
    } catch (err) {
      if (err?.response?.status !== 404) throw err;
    }
    await timeout(5000);
    /* eslint-enable no-await-in-loop */
  }
  return txData;
}

function drawAvatarInQRCode(canvas: HTMLCanvasElement, avatarSrc: string) {
  const context = canvas.getContext('2d');
  const image = new Image();
  image.onload = () => {
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
  const user = await getUserInfo(likerId);
  const { cosmosWallet, avatar } = user;
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
  const canvas = document.querySelector(selector) as HTMLCanvasElement;
  // TODO: check canvas is canvas
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
  if (!blocking) return { id: txId };
  const txData = await pollForTxComplete(txId);
  return { id: txId, ...txData };
}

export default {
  createPaymentQRCode,
  pollForTxComplete,
  getTx,
};
