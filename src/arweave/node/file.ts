import { promises as fs } from 'fs';
import glob from 'glob-promise';

export async function isDirectory(path: string): Promise<boolean> {
  return (await fs.lstat(path)).isDirectory();
}

export async function listFiles(inputFilePath: string): Promise<string[]> {
  let filePath = inputFilePath;
  if (inputFilePath[inputFilePath.length - 1] !== '/') {
    filePath += '/';
  }
  const list = await glob(`${filePath}**/*`);
  const isDir = await Promise.all(list.map((l) => isDirectory(l)));
  const filtered = list.filter((_, index) => !isDir[index]);
  return filtered.map((f) => f.replace(filePath, ''));
}
