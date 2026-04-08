const fs = require("fs");
const os = require("os");
const path = require("path");

const sampleDir = path.join(__dirname, "sample-files");
const demoFilePath = path.join(sampleDir, "demo.txt");
const largeFilePath = path.join(sampleDir, "largefile.txt");

async function main() {
  await fs.promises.mkdir(sampleDir, { recursive: true });

  console.log("Platform:", os.platform());
  console.log("CPU:", os.cpus()[0].model);
  console.log("Total Memory:", os.totalmem());

  const joinedPath = path.join(sampleDir, "folder", "file.txt");
  console.log("Joined path:", joinedPath);

  await fs.promises.writeFile(demoFilePath, "Hello from fs.promises!", "utf8");
  const demoText = await fs.promises.readFile(demoFilePath, "utf8");
  console.log("fs.promises read:", demoText);

  await new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(largeFilePath, {
      encoding: "utf8",
    });

    writeStream.on("error", reject);
    writeStream.on("finish", resolve);

    for (let index = 1; index <= 100; index += 1) {
      writeStream.write(`This is a line in a large file. Line ${index}\n`);
    }

    writeStream.end();
  });

  await new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(largeFilePath, {
      encoding: "utf8",
      highWaterMark: 1024,
    });

    readStream.on("data", (chunk) => {
      console.log("Read chunk:", chunk.slice(0, 40) + "...");
    });

    readStream.on("end", () => {
      console.log("Finished reading large file with streams.");
      resolve();
    });

    readStream.on("error", reject);
  });
}

main().catch((error) => {
  console.error("Error:", error.message);
});
