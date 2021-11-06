export type ArweavePrice = {
  key?: string;
  arweaveId?: string;
  AR: string;
  list?: ArweavePrice[];
}

export type ArweaveResult = {
  key?: string;
  arweaveId?: string;
  ipfsHash?: string;
}

export type ArweavePriceWithLIKE = {
  key?: string;
  arweaveId?: string;
  AR: string;
  LIKE: string;
  list?: ArweavePriceWithLIKE[];
}

export type estimateArweaveResponse = {
  key?: string;
  arweaveId?: string;
  AR: string;
  LIKE: string;
  list?: ArweavePriceWithLIKE[];
  ipfsHash: string;
  memo: string;
  address: string;
}

export type uploadArweaveResponse = {
  arweaveId: string;
  ipfsHash: string;
  list?: ArweaveResult[];
}
