import fs from "fs";
import path from "path";

// Use /tmp directory in production (Vercel allows writes here, but it's not persistent)
// For persistent storage, you need a database like MongoDB, PostgreSQL, or Vercel KV
const getDataPath = (fileName: string) => {
  // In production (Vercel), use /tmp directory
  if (process.env.VERCEL) {
    return path.join("/tmp", fileName);
  }
  // In development, use local src/data
  return path.join(process.cwd(), "src", "data", fileName);
};

const readData = (fileName: string) => {
  try {
    const filePath = getDataPath(fileName);
    
    // If file doesn't exist in /tmp (Vercel), try to copy from src/data
    if (process.env.VERCEL && !fs.existsSync(filePath)) {
      const sourcePath = path.join(process.cwd(), "src", "data", fileName);
      if (fs.existsSync(sourcePath)) {
        const sourceData = fs.readFileSync(sourcePath, "utf-8");
        fs.writeFileSync(filePath, sourceData, "utf-8");
      } else {
        // Create empty array if no source file
        fs.writeFileSync(filePath, "[]", "utf-8");
      }
    }
    
    const data = fs.readFileSync(filePath, "utf-8");
    return data.trim() ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${fileName}:`, error);
    return [];
  }
};

const writeData = (fileName: string, data: any) => {
  try {
    const filePath = getDataPath(fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${fileName}:`, error);
    throw error;
  }
};

export { readData, writeData };
