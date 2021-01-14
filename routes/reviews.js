const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn } = require('../middleware');
const Road = require('../models/road');
const Review = require('../models/review');
const reviews = require('../controllers/reviews');
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');



router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.delete('/:reviewId', catchAsync(reviews.deleteReview));


module.exports = router;