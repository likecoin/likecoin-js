import { ISCNSignPayload } from '@likecoin/iscn-js';
// eslint-disable-next-line import/no-extraneous-dependencies
import { OfflineSigner } from '@cosmjs/proto-signing';
import { estimateArweavePrice, uploadToArweave } from './api';
import { signingClient } from '../iscn';
import { sendLIKE } from '../tx';

export async function submitToArweaveAndISCN(
  files: string | File[],
  iscnMetadata: ISCNSignPayload,
  signer: OfflineSigner,
  fromAddress: string,
) {
  const estimate = await estimateArweavePrice(files);
  const {
    arweaveId: existingArweaveId,
    ipfsHash: existingIPFSHash,
    address,
    memo,
    LIKE,
  } = estimate;
  let arweaveId = existingArweaveId;
  let ipfsHash = existingIPFSHash;
  if (!arweaveId) {
    const res = await sendLIKE(fromAddress, address, LIKE, signer, memo);
    ({ arweaveId, ipfsHash } = await uploadToArweave(files, res.transactionHash));
  }
  let { contentFingerprints = [] } = iscnMetadata;
  if (!contentFingerprints) contentFingerprints = [];
  if (ipfsHash) contentFingerprints.push(`ipfs://${ipfsHash}`);
  contentFingerprints.push(`ar://${arweaveId}`);
  const iscnMetadataWithArweaveId = { ...iscnMetadata, contentFingerprints };
  await signingClient.setSigner(signer);
  const res = await signingClient.createISCNRecord(fromAddress, iscnMetadataWithArweaveId);
  return res;
}

export default submitToArweaveAndISCN;
