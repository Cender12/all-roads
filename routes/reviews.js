const express = require('express');
const router = express.Router({ mergeParams: true });

const Road = require('../models/road');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js');

const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

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
//     res.redirect(`/Roads/${id}');
// }))

module.exports = router;