const fs = require("fs");
const server = require("http").createServer();

server.on("request", (req, res) => {
  //////////////////
  // Solution 1: write whole file into variable, once ready - send to client
  /*   fs.readFile("test-file.txt", (err, data) => {
    if (err) console.log(err);
    res.end(data);
  }); */
  ///////////////////////
  // Solution 2: Streams, read one piece, once available, send to client using write string and so on... - problem readable stream faster then response = "backpressure"
  /*   const readable = fs.createReadStream("test-file.txt");
  readable.on("data", (chunk) => {
    res.write(chunk); // response is a writable string
  });
  // when all the data is written

  readable.on("end", () => {
    res.end();
  });

  readable.on("error", (err) => {
    console.log(err);
    res.statusCode(500);
    res.end("file not found");
  }); */
  //////////////////////
  // Solution 3: Pipe operator - available on all readable streams - pipe output of readable stream right into input of writable stream = fix backpressure
  const readable = fs.createReadStream("test-file.txt");
  // readableSource.pipe(writableDestination)
  readable.pipe(res);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening...");
});
