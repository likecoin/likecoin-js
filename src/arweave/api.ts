import Axios from 'axios';
import { EstimateArweaveResponse, UploadArweaveResponse } from '../types';
import { LIKE_CO_API } from '../constant';
import { createNewForm } from './form';
import isNode from './util';

const axios = Axios.create({
  baseURL: LIKE_CO_API,
  timeout: 60000,
});

export async function estimateArweavePrice(
  files: string | File[] | FileList,
  { deduplicate = true }: { deduplicate?: boolean } = {},
)
: Promise<EstimateArweaveResponse> {
  let form: any;
  if (typeof files === 'string') {
    if (!isNode()) throw new Error('file path is only supported in node.js');
    form = await createNewForm(files);
  } else {
    const fileArray = Array.from(files);
    form = await createNewForm();
    fileArray.forEach((f) => {
      form.append(f.name, f, f.name);
    });
  }
  const res = await axios.post('/arweave/estimate', form, {
    params: { deduplicate: deduplicate ? '1' : '0' },
    headers: isNode() ? { ...form.getHeaders() } : {},
  });
  const { data } = res;
  return data as EstimateArweaveResponse;
}

export async function uploadToArweave(
  files: string | File[] | FileList,
  txHash: string,
  { deduplicate = true }: { deduplicate?: boolean } = {},
)
  : Promise<UploadArweaveResponse> {
  let form: any;
  if (typeof files === 'string') {
    if (!isNode()) throw new Error('file path is only supported in node.js');
    form = await createNewForm(files);
  } else {
    const fileArray = Array.from(files);
    form = await createNewForm();
    fileArray.forEach((f) => {
      form.append(f.name, f, f.name);
    });
  }
  const res = await axios.post(`/arweave/upload?txHash=${txHash}`, form, {
    params: { deduplicate: deduplicate ? '1' : '0' },
    headers: isNode() ? { ...form.getHeaders() } : {},
  });
  const { data } = res;
  return data as UploadArweaveResponse;
}
