const EventEmitter = require("events"); //  class imported from events build-in node module
const http = require("http");

class Sales extends EventEmitter {
  // ES6 ES20156 syntax for class inheritance
  constructor() {
    super(); // call always when extend a super class - get access to ll the methods of the parent class
  }
}

const myEmmiter = new Sales();

// Observer pattern - observer observes an emmiter and waits until it emits an event
myEmmiter.on("newSale", () => {
  console.log("There was a new sale!");
}); // observer

myEmmiter.on("newSale", () => {
  console.log("Customer name: XXX");
}); // observer

myEmmiter.on("newSale", (stock) => {
  console.log(`There are now ${stock} items left in stock`);
}); // observer can take argument

myEmmiter.emit("newSale", 9); // emmiter

///////////////////////
//////////////////////

const server = http.createServer();

server.on("request", (req, res) => {
  console.log("Request received");
  console.log(req.url);
  res.end("Request received");
});

server.on("request", (req, res) => {
  console.log("Another request 😊");
});

server.on("close", () => {
  console.log("Server closed");
});

server.listen(8000, "localhost", () => {
  console.log("Waiting for requests...");
});
