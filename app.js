const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { RoadSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const Road = require('./models/road');
// const road = require('./models/road');
const Review = require('./models/review');

const roads = require('./routes/roads');


mongoose.connect('mongodb://localhost:27017/all-roads',{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

// MIDDLEWARE==============================================================================


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


app.use('/Roads', roads)

app.post('/Roads/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const road = await Road.findById(req.params.id);
    const review = new Review(req.body.review);
    road.reviews.push(review);
    await review.save();
    await road.save();
    res.redirect(`/Roads/${road._id}`);
}));

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found'), 404)
})

// ERROR HANDLER===========================================================================
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
});


//PORT LISTENER============================================================================
app.listen(3000, () => {
    console.log('Serving on port 3000...')
});
