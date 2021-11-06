import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

import { isDirectory, listFiles } from './file';

function handleSingleFile(form: FormData, filePath: string, key?: string) {
  const fieldName = key || path.basename(filePath);
  form.append(fieldName, fs.createReadStream(filePath), fieldName);
  return form;
}

async function handleDirectory(form: FormData, filePath: string) {
  const list = await listFiles(filePath);
  list.forEach((l) => form.append(l, fs.createReadStream(path.join(filePath, l)), l));
  return form;
}

export async function createNewForm(dataPath?: string): Promise<FormData> {
  const form = new FormData();
  if (dataPath) {
    const isDir = await isDirectory(dataPath);
    if (isDir) {
      await handleDirectory(form, dataPath);
    } else {
      await handleSingleFile(form, dataPath);
    }
  }
  return form;
}

export default createNewForm;
