import fs from 'fs/promises';
import path from 'path';

const BASE_DIR = './public/source';

export async function listDirectory(relativePath: string = '') {
  const targetDir = path.join(BASE_DIR, relativePath);
  const files = await fs.readdir(targetDir, { withFileTypes: true });

  return files.map((file) => ({
    name: file.name,
    isDirectory: file.isDirectory(),
    fullPath: path.join(relativePath, file.name),
  }));
}

export async function readFileContent(relativePath: string) {
  const fullPath = path.join(BASE_DIR, relativePath);
  return await fs.readFile(fullPath, 'utf-8');
}
