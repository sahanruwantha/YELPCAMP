const express = require('express');
const router = express.Router();
const cathAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgroud = require('../controllers/campground')


router.route('/')
    .get( cathAsync(campgroud.index))
    //.post(isLoggedIn ,validateCampground ,cathAsync(campgroud.createCampground));
    
    
router.get('/new', isLoggedIn , campgroud.renderNewForm);
    
    
    
router.route('/:id')
    .get(cathAsync(campgroud.showCampground))
    .put(isLoggedIn , isAuthor, validateCampground ,cathAsync(campgroud.updateCampground))
    .delete(isLoggedIn , cathAsync(campgroud.deleteCampground));



router.get('/:id/edit',isLoggedIn , isAuthor ,cathAsync(campgroud.renderEditForm));



module.exports = router;