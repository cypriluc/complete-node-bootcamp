const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`) // synchronous code can be outside callbacks - executed only once
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is: ${val}`);

  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Missing name or price' });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    // code 200 = OK
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length, // in a case data is the array with multiple objects
    data: {
      tours, // key should be the same as route name
    },
  });
};

exports.getTour = (req, res) => {
  // console.log(req.params); // object that automatically assigns value to a variable {id: '5'}
  const id = req.params.id * 1; // convert string to number
  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

exports.createTour = (req, res) => {
  // console.log(req.body); // need middleware

  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body); // Object.assign() - create new object by merging two existing objects - does not mutate original

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        statue: 'success',
        data: {
          tour: newTour,
        },
      }); // code 201 = CREATED
    }
  ); // inside callback - never block event loop with synchronous code!!!
};

exports.updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here ...>', //send updated tour
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({
    // 204 = no content
    status: 'success',
    data: null,
  });
};
