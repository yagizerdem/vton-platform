import path from "path";
import fs from "fs";

async function saveLocalFile(fileName: string, buffer: Buffer) {
  const filePath = path.join(process.cwd(), "uploads", fileName);
  await fs.promises.writeFile(filePath, buffer);
}

function bufferToBase64(buffer: Buffer, mimeType: string) {
  return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

export { saveLocalFile, bufferToBase64 };
