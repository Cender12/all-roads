const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { RoadSchema } = require('../schemas.js');
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

router.get('/new', (req, res) => {
    res.render('roads/new')
});

router.post('/', validateRoad, catchAsync(async(req, res, next) => {
        // if(!req.body.road) throw new ExpressError('Invalid Road Data', 400);
        const road = new Road (req.body.road);
        await road.save();
        req.flash('success', 'Successfully made a new road');
        res.redirect(`/Roads/${road._id}`) 
}));

router.get('/:id', catchAsync(async (req, res) => {
    const road = await (await Road.findById(req.params.id)).populate('reviews');
    res.render('roads/show', { road });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const road = await Road.findById(req.params.id)
    res.render('roads/edit', { road });
}));

router.put('/:id', validateRoad, catchAsync(async (req, res) => {
    const { id } = req.params;
    const road = await Road.findByIdAndUpdate(id, { ...req.body.road });
    req.flash('success','Successfully updated road!');
    res.redirect(`/Roads/${road._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Road.findByIdAndDelete(id);
    req.flash('success', 'Deleted the road');
    res.redirect('/Roads');
}));

module.exports = router;