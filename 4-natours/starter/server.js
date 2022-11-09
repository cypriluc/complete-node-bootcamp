const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// deal with deprecation
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

// create a basic schema - description and validation

const tourSchema = new mongoose.Schema({
  // name: String
  name: {
    type: String,
    required: [true, 'A tour must have a name'], // array [default value, error msg]
    unique: true, // name must be unique
  },
  rating: {
    type: Number,
    default: 4.5,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
});

// create a model out of the schema
const Tour = mongoose.model('Tour', tourSchema);

// create a document out of the model - same as create an Object out of a Class in ES6
const testTour = new Tour({
  name: 'The Park Camper',
  price: 997,
});

testTour
  .save()
  .then((doc) => {
    console.log(doc);
  })
  .catch((err) => {
    console.log('ERROR 🤯🤯', err);
  }); // save to the tour collection in db

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
