
const express = require('express');
const router = express.Router();
const user = require('../controllers/user')
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');

router.get('/register', user.renderRegister);


router.post('/register', catchAsync(user.registerNewUser));


router.get('/login', user.renderLogin)


router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    user.loginUser
)

router.get('/logout', user.logoutUser)

module.exports = router;