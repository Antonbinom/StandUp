import fs from "node:fs/promises";

export async function checkFile(path, isFileExists) {
  if (isFileExists) {
    try {
      await fs.access(path);
      console.log(`File ${path} found.`);
    } catch (err) {
      await fs.writeFile(path, JSON.stringify([]));
      console.log(`File ${path} created.`);
      return true;
    }
  }
  try {
    await fs.access(path)
    console.log(`File ${path} found. Starting the server...`);
  } catch (error) {
    console.error(`Error: File ${path} not found. Server will not start.`);
    return false;
  }

  return true;
}