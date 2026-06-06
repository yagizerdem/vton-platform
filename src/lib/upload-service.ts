import path from "path";
import fs from "fs";

async function saveLocalFile(fileName: string, buffer: Buffer) {
  const filePath = path.join(process.cwd(), "uploads", fileName);
  await fs.promises.writeFile(filePath, buffer);
}
export default saveLocalFile;
