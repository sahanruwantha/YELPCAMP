const express = require('express');
const router = express.Router({mergeParams:true});
const cathAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground')
const Review = require('../models/review');
const { reviewSchema } = require('../schema.js');

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview ,cathAsync(async (req, res)=>{
    const campgroud = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campgroud.reviews.push(review);
    await review.save();
    await campgroud.save();
    res.redirect(`/campgrounds/${campgroud._id}`);
}));

router.delete('/:reviewId', cathAsync( async (req, res)=>{
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);

}));

module.exports = router