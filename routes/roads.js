const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { RoadSchema } = require('../schemas.js');
const {isLoggedIn } = require('../middleware');

const ExpressError = require('../utilities/ExpressError');
const Road = require('../models/road');

//MIDDLEWARE===============================================================
const validateRoad = (req, res, next) => {
    const { error } = RoadSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

//ROUTES===============================================================
router.get('/', catchAsync(async (req, res) => {
   const roadCollection = await Road.find({});
   res.render('roads/index', { roadCollection })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('roads/new');
});

router.post('/', isLoggedIn, validateRoad, catchAsync(async(req, res, next) => {
        // if(!req.body.road) throw new ExpressError('Invalid Road Data', 400);
        const road = new Road (req.body.road);
        road.author = req.user._id;
        await road.save();
        req.flash('success', 'Successfully made a new road');
        res.redirect(`/Roads/${road._id}`) 
}));

router.get('/:id', catchAsync(async (req, res) => {
    const road = await Road.findById(req.params.id).populate('reviews').populate('author');
    console.log(road);
    if(!road){
        req.flash('error', 'Cannot find that road!');
        return res.redirect('/Roads');
    }
    res.render('roads/show', { road });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const road = await Road.findById(req.params.id);
    if(!road){
        req.flash('error', 'Cannot find that road!');
        return res.redirect('/Roads');
    }
    res.render('roads/edit', { road });
}));

router.put('/:id', isLoggedIn, validateRoad, catchAsync(async (req, res) => {
    const { id } = req.params;
    const road = await Road.findByIdAndUpdate(id, { ...req.body.road });
    req.flash('success','Successfully updated road!');
    res.redirect(`/Roads/${road._id}`);
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Road.findByIdAndDelete(id);
    req.flash('success', 'Road Deleted');
    res.redirect('/Roads');
}));

module.exports = router;