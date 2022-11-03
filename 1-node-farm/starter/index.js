// 1) core modules
const fs = require('fs'); // file system - build-in module fs --> access to file system functions
const http = require('http'); // build-in http module - networking capability - building http server
const url = require('url');
// 2) third party modules
const slugify = require('slugify');
// 3) own modules from local file system
const replaceTemplate = require('./modules/replaceTemplate');

//////////////////////////////////////////////////////
/////////////////// FILES

///////// BLOCKING, synchronous way /////////////
/* const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
console.log(textIn);

const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync("./txt/output.txt", textOut);

console.log("file written"); */

///////// NON-BLOCKING, asynchronous way /////////////////
/* fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
  if (err) return console.log("ERROR! 🤯");
  fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
    console.log(data2);
    fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
      console.log(data3);

      fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
        console.log("Your file has been written ☀️");
      });
    });
  });
});
console.log("Will read file!"); */

//////////////////////////////////////////////////////
/////////////////// SERVER

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8'); // use sync - executed only once at the beginning, use async for code that is being executed over and over again
const dataObject = JSON.parse(data); // turn json into js object

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const slugs = dataObject.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

//  Create Server
const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  // Routing
  // Oerview Page
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });

    const cardsHtml = dataObject.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output); // send back a response
  }

  // Product Page
  else if (pathname === '/product') {
    res.writeHead(200, {
      'Content-Type': 'text/html',
    });
    const product = dataObject[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }

  // API
  else if (pathname === '/api') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });
    res.end(data);
  }

  // NOT FOUND
  else {
    res.writeHead(404, {
      'Content-Type': 'text/html', // headers must be set before sending the response
      'my-own-header': 'hello-world',
    });
    res.end('<h1>Page not found!</h1>');
  }
});

// Start the Server
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
