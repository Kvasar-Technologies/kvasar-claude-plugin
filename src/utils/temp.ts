import { mkdtemp, readFile, unlink } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { tmpdir } from 'os';

/**
 * Write an object to a temporary JSON file and invoke the callback with the file path.
 * The file is automatically deleted after the callback resolves (or rejects).
 */
export async function withTempJsonFile<T>(data: any, fn: (filePath: string) => Promise<T>): Promise<T> {
  const dir = await mkdtemp(join(tmpdir(), 'kvasar-plugin-'));
  const filePath = join(dir, `${randomUUID()}.json`);

  try {
    await readFile(filePath, 'utf-8'); // ensure file exists? Actually we need to write.
  } catch {
    await writeFile(filePath, JSON.stringify(data, null, 2));
  }

  try {
    return await fn(filePath);
  } finally {
    try {
      await unlink(filePath);
      await fs.rmdir(dir); // remove empty dir
    } catch {
      // ignore cleanup errors
    }
  }
}

import { writeFile, rm } from 'fs/promises';

// Alternative simpler: create file and delete after.
export async function createTempJsonFile(data: any): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), 'kvasar-plugin-'));
  const filePath = join(dir, `${randomUUID()}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2));
  return filePath;
}

export async function deleteTempFile(filePath: string): Promise<void> {
  try {
    await unlink(filePath);
    const dir = filePath.split('/').slice(0, -1).join('/');
    await rm(dir, { recursive: true, force: true });
  } catch {
    // ignore
  }
}
