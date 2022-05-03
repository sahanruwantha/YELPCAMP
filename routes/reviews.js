const express = require('express');
const router = express.Router({mergeParams:true});
const cathAsync = require('../utils/catchAsync');
const Review = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


router.post('/', isLoggedIn ,validateReview ,cathAsync(Review.createReview));

router.delete('/:reviewId',isLoggedIn ,isReviewAuthor , cathAsync(Review.deleteReview));

module.exports = router;