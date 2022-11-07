const express = require('express');
const morgan = require('morgan'); // 3rd party middleware for login

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(morgan('dev')); // 3rd party middleware
app.use(express.json()); // add middleware - function modifying incoming request data - e.g. data from the body is added to the request object
app.use(express.static(`${__dirname}/public`)); //serve static files

// create a middleware - applyies to each request if route is not defined
app.use((req, res, next) => {
  console.log('Hello from the middleware 👋🏻');
  next(); // !!!!!! next must be in every middleware
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES - mount routes
app.use('/api/v1/tours', tourRouter); // middleware
app.use('/api/v1/users', userRouter); // middleware

module.exports = app;
