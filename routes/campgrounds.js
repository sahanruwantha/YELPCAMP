const express = require('express');
const router = express.Router();
const cathAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgroud = require('../controllers/campground')


router.get('/', cathAsync(campgroud.index));

router.get('/new', isLoggedIn , campgroud.renderNewForm;

router.post('/', isLoggedIn ,validateCampground ,cathAsync(campgroud.createCampground));

router.get('/:id',cathAsync(campgroud.showCampground));

router.get('/:id/edit',isLoggedIn , isAuthor ,cathAsync(campgroud.renderEditForm));

router.put('/:id', isLoggedIn , isAuthor, validateCampground ,cathAsync(campgroud.updateCampground));

router.delete('/:id',isLoggedIn , cathAsync(campgroud.deleteCampground()));

module.exports = router;