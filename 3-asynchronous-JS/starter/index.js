const fs = require('fs');
const superagent = require('superagent');

////////////////////////////////
///////// CALLBACK HELL
/* fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
  console.log(`Breed: ${data}`);

  superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err, res) => {
    if (err) return console.log(err.message);
    console.log(res.body.message);

    fs.writeFile('dog-img.txt', res.body.message, (err) => {
      if (err) return console.log(err.message);
      console.log('Random dog image saved to file');
    });
  });
}); */

////////////////////////////////
///////// PROMISES - flat structure of chained promises
// Promise: Pending Promise --> Resolved Promise: Fullfilled (result) OR Rejected (error)
// Consume Promises - .then method

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('I could not find that file 😿'); // later available in catch method
      resolve(data); // value the promise returns - available in .then method
    });
  }); // ES6 promise constructor
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Could not write the file 😥');
      resolve('Success');
    });
  });
};

/* 
readFilePro(`${__dirname}/dog.txt`)
  .then((data) => {
    console.log(`Breed: ${data}`);
    return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
  })
  .then((res) => {
    console.log(res.body.message);
    return writeFilePro('dog-img.txt', res.body.message);
  })
  .then(() => {
    console.log('Random dog image saved to file');
  })
  .catch((err) => {
    console.log(err);
  }); */

////////////////////////////////
///////// ASYNC-AWAIT - ES8  - asynchronous function not blocking event loop, automatically returns promise - allow to make the code look more synchronous - get rid of .then handlers anc callbacks -> 'syntetic sugar on promises'

/* 
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`); // stop code - wait until the value comes and store into variable
    console.log(`Breed: ${data}`);

    const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    console.log(res.body.message);

    await writeFilePro('dog-img.txt', res.body.message);

    console.log('Random dog image saved to file');
  } catch (err) {
    console.log(err);
    throw err; // mark entire promise as rejected
  }
  return '2: 🐶 READY';
}; 
*/

// solution for more promises at once - Promise.all
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`); // stop code - wait until the value comes and store into variable
    console.log(`Breed: ${data}`);

    const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`); // save a promise, not its resolved value
    const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);

    // get the resolved values
    const all = await Promise.all([res1Pro, res2Pro, res3Pro]); // runs all promises ath the same time
    const imgs = all.map((el) => el.body.message);
    console.log(imgs);

    await writeFilePro('dog-img.txt', imgs.join('\n'));

    console.log('Random dog images saved to file');
  } catch (err) {
    console.log(err);
    throw err; // mark entire promise as rejected
  }
  return '2: 🐶 READY';
};

/* 
console.log('1: Will get dog pics!');
getDogPic()
  .then((x) => {
    console.log(x);
    console.log('3: Done getting dogs!');
  })
  .catch((err) => console.log('ERROR 🤯')); 
  */

// IIFE (Immediately Invoked Function Expression)
(async () => {
  try {
    console.log('1: Will get dog pics!');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done getting dogs!');
  } catch (err) {
    console.log('ERROR 🤯');
  }
})();
