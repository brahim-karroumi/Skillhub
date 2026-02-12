import fs from "fs";
import path from "path";

const readData = (fileName) => {
  const filePath = path.join(process.cwd(), "src", "data", fileName);
  const data = fs.readFileSync(filePath, "utf-8");
  return data.trim() ? JSON.parse(data) : [];
};

const writeData = (fileName, data) => {
  const filePath = path.join(process.cwd(), "src", "data", fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
};

export { readData, writeData };
