import { isNode } from './util';


export async function createNewForm(filePath?: string) {
  if (isNode()) {
    const res = await import ('./node/form');
    return await res.createNewForm(filePath);
  }
  const form = new FormData();
  return form;
}

export default createNewForm;
