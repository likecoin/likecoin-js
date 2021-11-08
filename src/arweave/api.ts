import Axios from 'axios';
import { estimateArweaveResponse, uploadArweaveResponse } from '../types';
import { LIKE_CO_API } from '../constant';
import { createNewForm } from './form';
import isNode from './util';

const axios = Axios.create({
  baseURL: LIKE_CO_API,
  timeout: 60000,
});

export async function estimateArweavePrice(files: string | File[]) {
  let form: any;
  if (typeof files === 'string') {
    if (!isNode()) throw new Error('file path is only supported in node.js');
    form = await createNewForm(files);
  } else {
    form = await createNewForm();
    (files as File[]).forEach((f) => {
      form.append(f.name, f, f.name);
    });
  }
  const res = await axios.post('/arweave/estimate', form, {
    headers: { ...form.getHeaders() },
  });
  const { data } = res;
  return data as estimateArweaveResponse;
}

export async function uploadToArweave(files: string | File[], txHash: string) {
  let form: any;
  if (typeof files === 'string') {
    if (!isNode()) throw new Error('file path is only supported in node.js');
    form = await createNewForm(files);
  } else {
    form = await createNewForm();
    (files as File[]).forEach((f) => {
      form.append(f.name, f, f.name);
    });
  }
  const res = await axios.post(`/arweave/upload?txHash=${txHash}`, form, {
    headers: { ...form.getHeaders() },
  });
  const { data } = res;
  return data as uploadArweaveResponse;
}
