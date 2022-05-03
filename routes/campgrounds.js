const express = require('express');
const router = express.Router();
const cathAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground')
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');

router.get('/', cathAsync(
    async (req, res)=>{
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', {campgrounds})
    }
));

router.get('/new', isLoggedIn , (req, res)=>{
    res.render('campgrounds/new');
});

router.post('/', isLoggedIn ,validateCampground ,cathAsync(async (req, res, next)=>{
        if(!req.body.campground) throw new ExpressError('Invalid campgroud data', 400);
        const campground =  new Campground(req.body.campground);
        campground.author = req.user._id;
        await campground.save();
        req.flash('success', 'Successfully made a new campground!');
        res.redirect(`/campgrounds/${campground._id}`);
}));

router.get('/:id',cathAsync(async (req, res)=>{
    const campground = await Campground.findById(req.params.id).populate
    ({
        path: 'reviews',
        populate: 
        {
            path: 'author'
        }
    }).populate('author');
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}));

router.get('/:id/edit',isLoggedIn , isAuthor ,cathAsync(
    async (req, res)=>{
        const campground = await Campground.findById(req.params.id);
        if (!campground) {
            req.flash('error', 'Cannot find that campground!');
            return res.redirect('/campgrounds');
        }
        res.render('campgrounds/edit', {campground});
    }
));

router.put('/:id', isLoggedIn , isAuthor, validateCampground ,cathAsync(
    async (req, res)=>{
        const campgroud =  await Campground.findByIdAndUpdate(id, {...req.body.campground});
        req.flash('success', 'successfully updated campground')
        res.redirect(`/campgrounds/${campground._id}`);
    }
));

router.delete('/:id',isLoggedIn , cathAsync(
    async (req, res)=>{
        await Campground.findByIdAndDelete(req.params.id);
        res.redirect('/campgrounds/');
    }
));

module.exports = router;