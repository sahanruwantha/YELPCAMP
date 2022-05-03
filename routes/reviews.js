const express = require('express');
const router = express.Router({mergeParams:true});
const cathAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const Review = require('../models/review');
const { validateReview, isLoggedIn } = require('../middleware');


router.post('/', isLoggedIn ,validateReview ,cathAsync(async (req, res)=>{
    const campgroud = await Campground.findById(req.params.id); 
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campgroud.reviews.push(review);
    await review.save();
    await campgroud.save();
    res.redirect(`/campgrounds/${campgroud._id}`);
}));

router.delete('/:reviewId',isLoggedIn ,cathAsync( async (req, res)=>{
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);

}));

module.exports = router