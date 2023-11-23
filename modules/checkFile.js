import fs from "node:fs/promises";

export async function checkFile(path, notNecessary) {
  if (notNecessary) {
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
    return true;
  } catch (err) {
    console.error(`Error: File ${path} not found. Server will not start.`);
    return false;
  }

  // return true;
}