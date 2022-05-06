const express = require('express');
const router = express.Router();
const cathAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware');
const campgroud = require('../controllers/campground')
const multer  = require('multer');
const { storage } = require( '../cloudinary' );
const { redirect } = require( 'express/lib/response' );
const upload = multer({ storage })

router.route('/')
    .get( cathAsync(campgroud.index))
    .post(isLoggedIn ,validateCampground , upload.array('image'),cathAsync(campgroud.createCampground));
    // .post(upload.single('image'), (req,res)=>{
    //     console.log(req.body, req.file)
    //     res.send('it worked');
    // })

    
router.get('/new', isLoggedIn , campgroud.renderNewForm);
    
    
    
router.route('/:id')
    .get(cathAsync(campgroud.showCampground))
    .put(isLoggedIn , isAuthor, validateCampground ,cathAsync(campgroud.updateCampground))
    .delete(isLoggedIn , cathAsync(campgroud.deleteCampground));



router.get('/:id/edit',isLoggedIn , isAuthor ,cathAsync(campgroud.renderEditForm));



module.exports = router;