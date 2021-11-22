// eslint-disable-next-line import/no-extraneous-dependencies
import { OfflineSigner } from '@cosmjs/proto-signing';
import { ISCNSigningClient, ISCNQueryClient, ISCNSignPayload } from '@likecoin/iscn-js';
import { COSMOS_RPC } from '../constant';

export const signingClient = new ISCNSigningClient();
export const queryClient = new ISCNQueryClient();

export async function queryISCNIdsByTx(txHash: string): Promise<string[]> {
  await queryClient.connect(COSMOS_RPC);
  const res = await queryClient.queryISCNIdsByTx(txHash);
  return res;
}

export async function queryRecordsById(id: string) {
  await queryClient.connect(COSMOS_RPC);
  const res = await queryClient.queryRecordsById(id);
  return res;
}

export async function createISCNRecord(signer: OfflineSigner, ISCNPayload: ISCNSignPayload) {
  const [from] = await signer.getAccounts();
  await signingClient.connectWithSigner(COSMOS_RPC, signer);
  const res = await signingClient.createISCNRecord(from.address, ISCNPayload);
  return res;
}
