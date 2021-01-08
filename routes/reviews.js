const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview } = require('../middleware');
const Road = require('../models/road');
const Review = require('../models/review');
const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');



router.post('/', validateReview, catchAsync(async (req, res) => {
    const road = await Road.findById(req.params.id);
    const review = new Review(req.body.review);
    road.reviews.push(review);
    await review.save();
    await road.save();
    req.flash('success', 'Created new review');
    res.redirect(`/Roads/${road._id}`);
}));

// app.delete('/reviewId', catchAsync(async (req, res) => {
//     const { id, reviewId } = req.params;
//     await Road.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
//     await Review.findByIdAndDelete(reviewId);
//     req.flash('success', Review Deleted');
//     res.redirect(`/Roads/${id}');
// }))

module.exports = router;