import { loadProject } from './utils/loadProject';
import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { ejsContentDiff } from './utils/ejsContentDiff';

const filesMap = await loadProject(path.resolve(__dirname, '../input'));

const prefixPath = path.resolve(__dirname, '../output');
const dirCheckMap: Record<string, boolean> = {};

if (existsSync(prefixPath)) {
  await fs.rm(prefixPath, { recursive: true }); // remove output folder
}
await fs.mkdir(prefixPath, { recursive: true }); // create output folder

for (const [fileRelativePath, content] of Object.entries(filesMap)) {
  const fileFullPath = path.resolve(prefixPath, fileRelativePath);
  const fileDir = path.dirname(fileFullPath);
  if (fileRelativePath.endsWith('.ejs')) {
    const filePath = fileRelativePath.replace(/\.ejs$/, '');
    ejsContentDiff(filesMap[fileRelativePath], filesMap[filePath]);
  }

  if (!dirCheckMap[fileDir]) {
    await fs.mkdir(fileDir, { recursive: true });
    dirCheckMap[fileDir] = true;
  }

  fs.writeFile(fileFullPath, content, 'utf-8');
}
