const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const {RoadSchema} = require('./schemas.js');
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const Road = require('./models/road');
// const road = require('./models/road');
const Review = require('./models/review');

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

const validateRoad = (req, res, next) => {
    const { error } = RoadSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


//ROUTES===================================================================================
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/Roads', catchAsync(async (req, res) => {
   const roadCollection = await Road.find({});
   res.render('roads/index', { roadCollection })
}));

app.get('/Roads/new', (req, res) => {
    res.render('roads/new')
});

app.post('/Roads', validateRoad, catchAsync(async(req, res, next) => {
        // if(!req.body.road) throw new ExpressError('Invalid Road Data', 400);
        const road = new Road (req.body.road);
        await road.save();
        res.redirect(`/Roads/${road._id}`) 
}));

app.get('/Roads/:id', catchAsync(async (req, res) => {
    const road = await Road.findById(req.params.id)
    res.render('roads/show', { road });
}));

app.get('/Roads/:id/edit', catchAsync(async (req, res) => {
    const road = await Road.findById(req.params.id)
    res.render('roads/edit', { road });
}));

app.put('/Roads/:id', validateRoad, catchAsync(async (req, res) => {
    const { id } = req.params;
    const road = await Road.findByIdAndUpdate(id, { ...req.body.road })
    res.redirect(`/Roads/${road._id}`)
}));

app.delete('/Roads/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Road.findByIdAndDelete(id);
    res.redirect('/Roads');
}));

app.post('/Roads/:id/reviews', catchAsync(async (req, res) => {
    res.send('You made it safely!')
    // const road = await Road.findById(req.params.id);
    // const review = new Review(req.body.review);
    // road.reviews.push(review);
    // await review.save();
    // await road.save();
    // res.redirect(`/Roads/${road._id}`);
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
