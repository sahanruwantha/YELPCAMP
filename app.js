const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate');
const cathAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');

mongoose.connect('mongodb://localhost:27017/yelp-camp',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", ()=>{
    console.log("database connected");
});


app.engine('ejs', ejsMate);
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))


app.get('/', (req, res)=>{
    res.render('home');
    
});

app.get('/campgrounds', cathAsync(
    async (req, res)=>{
        const campgrounds = await Campground.find({})
        res.render('campgrounds/index', {campgrounds})
    }
))

app.get('/campgrounds/new', (req, res)=>{
    res.render('campgrounds/new');
});

app.post('/campgrounds', cathAsync(async (req, res, next)=>{
        if(!req.body.campground) throw new ExpressError('Invalid campgroud data', 400);
        const campground =  new Campground(req.body.campground);
        await campground.save();
        res.redirect(`/campgrounds/${campground._id}`);
        console.log(req.body);
}));




app.get('/campgrounds/:id', cathAsync(async (req, res)=>{
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/show', {campground});
}))

app.get('/campgrounds/:id/edit', cathAsync(
    async (req, res)=>{
        const campground = await Campground.findById(req.params.id);
        res.render('campgrounds/edit', {campground});
    }
))

app.put('/campgrounds/:id', cathAsync(
    async (req, res)=>{
        const { id } = req.params
        const campground =  await Campground.findByIdAndUpdate(id, {...req.body.campground});
        res.redirect(`/campgrounds/${campground._id}`);
    }
))

app.delete('/campgrounds/:id', cathAsync(
    async (req, res)=>{
        const { id } = req.params
        await Campground.findByIdAndDelete(id);
        res.redirect('/campgrounds/');
    }
))

app.all('*', (req, res, next)=>{
    next(new ExpressError('page not found', 404))
})

app.use((err, req, res, next)=>{
    const {statusCode= 500, massage = 'opps!!! something went wrong' } = err;
    res.status(statusCode).render('error');
});

app.listen(3000); 