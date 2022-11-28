const mongoose = require('mongoose');

// create a basic schema - description and validation

/////////////////////
// mongoose SCHEMA: describing data structure, default values, validation
const tourSchema = new mongoose.Schema({
  // name: String
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // array [default value, error msg]
    unique: true, // name must be unique
    trim: true, // removes whitespaces at the beggining and end - only works fir strings
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have a difficulty'],
  },
  ratingsAverage: {
    type: Number,
    default: 4.5,
  },
  retingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image'],
  },
  images: [String], // array of strings
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  startDates: [Date], // array of Dates - whne a tour starts
});

//////////////////////////
// mongoose MODEL: wrapper for the schema, providing an interface to the database for CRUD operations
// create a model out of the schema
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
