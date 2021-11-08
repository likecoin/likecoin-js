import { estimateArweavePrice, uploadToArweave } from './api';
import signingClient from '../iscn';
import { sendLIKE } from '../tx';

export async function submitToArweaveAndISCN(
  files: string | File[],
  iscnMetadata,
  signer,
  fromAddress,
) {
  const estimate = await estimateArweavePrice(files);
  const {
    arweaveId: existingArweaveId,
    address,
    memo,
    LIKE,
  } = estimate;
  let arweaveId = existingArweaveId;
  if (!arweaveId) {
    const res = await sendLIKE(fromAddress, address, LIKE, signer, memo);
    ({ arweaveId } = await uploadToArweave(files, res.transactionHash));
  }
  let { contentFingerprints = [] } = iscnMetadata;
  if (!contentFingerprints) contentFingerprints = [];
  contentFingerprints.push(`ar://${arweaveId}`);
  const iscnMetadataWithArweaveId = { ...iscnMetadata, contentFingerprints };
  await signingClient.setSigner(signer);
  const res = await signingClient.createISCNRecord(fromAddress, iscnMetadataWithArweaveId);
  return res;
}

export default submitToArweaveAndISCN;
