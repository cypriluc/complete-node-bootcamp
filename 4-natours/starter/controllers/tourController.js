const Tour = require('../models/tourModel');

/* const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`) // synchronous code can be outside callbacks - executed only once
); */

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1a) Filtering
    const queryObj = { ...req.query }; // create a shallow copy of req.query object - since ES6 destructuring
    const excludedFields = ['page', 'sort', 'limit', 'fields']; // create a copy of all the fields that should be excluded
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1b) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`); // match word and replace - use regular expression wrap with '\b' for only the same word - not a part of a word, 'g' - use multiple times,

    let query = Tour.find(JSON.parse(queryStr)); // find method returns a Query object - mongoose methods Query.prototype are available, methods are not possible to chain if we await the result right away

    // 2) Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' '); // get array of all sorting field names and put them together as string, but separated with space
      console.log(sortBy);
      query = query.sort(sortBy); // ascending order if sort=+price in query, descending if sort=-price
      // sort('price ratingsAverage')
    } else {
      query = query.sort('-createdAt'); // set default sorting - from the newest date created
    }

    // 3) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      // select('name duration price') // projecting
      query = query.select(fields);
    } else {
      query = query.select('-__v'); // excluding __v field
    }

    // EXECUTE QUERY
    const tours = await query;

    // const query = Tour.find()
    //   .where('duration')
    //   .equals(5) // all other methods lt, lte...
    //   .where('difficulty')
    //   .equals('easy');

    // SEND RESPONSE
    res.status(200).json({
      // code 200 = OK
      status: 'success',
      results: tours.length, // in a case data is the array with multiple objects
      data: {
        tours, // key should be the same as route name
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id); // mongoose helper method
    // == Tour.findOne({ _id: req.params.id})

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  // const newTour = new Tour({});
  // newTour.save();
  try {
    const newTour = await Tour.create(req.body); // call create method on the model itself, returns promise

    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    }); // code 201 = CREATED
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      // 204 = no content
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
