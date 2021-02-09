if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

console.log(process.env.SECRET)


// REQUIRES===================================================================
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const { RoadSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const Road = require('./models/road');
const Review = require('./models/review');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const mongoSanitize = require('express-mongo-sanitize');

//requires road and review routes
const userRoutes = require('./routes/users');
const roadRoutes = require('./routes/roads');
const reviewRoutes = require('./routes/reviews');

// MONGOOSE=================================================================
mongoose.connect('mongodb://localhost:27017/all-roads',{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
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
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());


// REMOVES DEPRICATION AND SPECIFIES COOKIE SETTINGS======================================
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //ms to s to mins to hrs to days 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}


// FLASH==================================================================================
app.use(session(sessionConfig))
app.use(flash());

// PASSPORT AUTHENTICATION=================================================================
//make sure session comes before(above)
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.query);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.get('/fakeUser', async (req, res) => {
    const user = new User({email: 'chris@gmail.com', username: 'Chrisss'});
    const newUser = await User.register(user, 'Ender');
    res.send(newUser);
})

//  ROUTE HANDLERS========================================================================
app.use('/', userRoutes);
app.use('/Roads', roadRoutes);
app.use('/Roads/:id/reviews', reviewRoutes);


// ERROR HANDLERS=========================================================================
// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page Not Found'), 404)
// })

app.get('/', (req, res) => {
    res.render('home')
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
});


// PORT LISTENER============================================================================
app.listen(3000, () => {
    console.log('Serving on port 3000...')
});
