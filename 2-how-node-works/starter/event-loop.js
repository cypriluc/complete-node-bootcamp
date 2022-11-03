fs = require("fs");
const crypto = require("crypto");

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4;

setTimeout(() => console.log("Timer 1 finished"), 0); // 2
setImmediate(() => console.log("Immediate 1 finished")); // 3

fs.readFile("test-file.txt", () => {
  console.log("I/O finished"); // 4
  console.log("-----------------------------");

  setTimeout(() => console.log("Timer 2 finished"), 0); // 7 - after setImmediate
  setTimeout(() => console.log("Timer 3 finished"), 3000);
  setImmediate(() => console.log("Immediate 1 finished")); // 6 - after process.nextTick

  process.nextTick(() => console.log("Process.nextTick")); // 5 - first in callback

  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encrypted");
  });
  crypto.pbkdf2("password", "salt", 100000, 1024, "sha512", () => {
    console.log(Date.now() - start, "password encrypted");
  });
});

console.log("Hello from the top-level code"); // 1
