const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const sampleDir = path.join(__dirname, "sample-files");
const filePath = path.join(sampleDir, "sample.txt");
const message = "Hello, async world!";

// Create the file before reading it in any async pattern.
fs.mkdirSync(sampleDir, { recursive: true });
fs.writeFileSync(filePath, message, "utf8");

fs.readFile(filePath, "utf8", (err, data) => {
  if (err) {
    console.error("Callback Error:", err.message);
  } else {
    console.log("Callback read:", data);
  }

  // Callback hell example:
  // Nesting many callbacks makes code hard to read and maintain.
  // fs.readFile(filePath, 'utf8', (errA, dataA) => {
  //   if (errA) return console.error(errA);
  //   fs.readFile(filePath, 'utf8', (errB, dataB) => {
  //     if (errB) return console.error(errB);
  //     fs.readFile(filePath, 'utf8', (errC, dataC) => {
  //       if (errC) return console.error(errC);
  //       console.log(dataA, dataB, dataC);
  //     });
  //   });
  // });

  // Converted callback code to Promise style using util.promisify.
  const readFilePromise = promisify(fs.readFile);

  readFilePromise(filePath, "utf8")
    .then((promiseData) => {
      console.log("Promise read:", promiseData);

      // Converted Promise code to async/await style.
      const readFileAsync = async () => {
        try {
          const asyncData = await readFilePromise(filePath, "utf8");
          console.log("Async/Await read:", asyncData);
        } catch (asyncErr) {
          console.error("Async/Await Error:", asyncErr.message);
        }
      };

      return readFileAsync();
    })
    .catch((promiseErr) => {
      console.error("Promise Error:", promiseErr.message);
    });
});
