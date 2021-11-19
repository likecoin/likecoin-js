// eslint-disable-next-line import/no-extraneous-dependencies
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from '@cosmjs/stargate';
// eslint-disable-next-line import/no-extraneous-dependencies
import { OfflineSigner, decodeTxRaw } from '@cosmjs/proto-signing';
import { MsgSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import BigNumber from 'bignumber.js';
import {
  COSMOS_DENOM,
  TRANSFER_GAS,
  DEFAULT_GAS_PRICE_NUMBER,
  COSMOS_RPC,
} from '../constant';

export const DEFAULT_TRANSFER_FEE = {
  gas: TRANSFER_GAS.toString(),
  amount: [{
    amount: new BigNumber(TRANSFER_GAS).multipliedBy(DEFAULT_GAS_PRICE_NUMBER).toFixed(0, 0),
    denom: COSMOS_DENOM,
  }],
};

export async function sendLIKE(
  fromAddress: string,
  toAddress: string,
  amount: string,
  signer: OfflineSigner,
  memo: string,
) {
  const client = await SigningStargateClient.connectWithSigner(COSMOS_RPC, signer);
  const coins = [{ amount: new BigNumber(amount).shiftedBy(9).toFixed(0, 0), denom: COSMOS_DENOM }];
  const res = await client.sendTokens(fromAddress, toAddress, coins, DEFAULT_TRANSFER_FEE, memo);
  assertIsBroadcastTxSuccess(res);
  return res;
}

export async function queryLIKETransaction(txHash: string) {
  const client = await StargateClient.connect(COSMOS_RPC);
  const tx = await client.getTx(txHash);
  if (!tx) return null;
  const {
    code,
    tx: rawTx,
  } = tx;
  if (code) return tx;
  const t = decodeTxRaw(rawTx);
  const { body } = t;
  const { messages: rawMessages } = body;
  const messages = rawMessages.map(((m) => {
    const { typeUrl, value } = m;
    if (typeUrl === '/cosmos.bank.v1beta1.MsgSend') {
      const payloadValue = MsgSend.decode(value);
      return {
        typeUrl,
        value: payloadValue,
      };
    }
    return m;
  }));
  return {
    ...tx,
    code,
    tx: {
      ...t,
      body: {
        ...body,
        messages,
      },
    },
  };
}
