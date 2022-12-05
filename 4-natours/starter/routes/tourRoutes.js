const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router(); // create new router

// middleware for a request with a given parameter
// router.param('id', tourController.checkID);

router
  .route('/top-5-cheap') // add custom route address - aliasing
  .get(tourController.aliasTopTours, tourController.getAllTours); // use middleware to manipulate querystring

router.route('/tour-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour); // chain middlewares

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
