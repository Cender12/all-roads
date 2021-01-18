const express = require('express');
const router = express.Router();
const roads = require('../controllers/roads')
const catchAsync = require('../utilities/catchAsync');
const {isLoggedIn, validateRoad, isAuthor} = require('../middleware');
const Road = require('../models/road');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });



//ROUTES===============================================================

router.route('/')
    .get(catchAsync(roads.index)) //roads.index function is now located in ../controllers/roads.js
    // .post(isLoggedIn, validateRoad, catchAsync(roads.createRoad));
    .post(upload.array('image'),(req, res) => {
        console.log(req.body, req.files);
        res.send('It worked')
    });

router.get('/new', isLoggedIn, roads.renderNewForm); //roads.renderNewForm function is now located in ../controllers/roads.js


router.route('/:id')
    .get(catchAsync(roads.showRoad))
    .put(isLoggedIn, isAuthor, validateRoad, catchAsync(roads.updateRoad))
    .delete(isLoggedIn, isAuthor, catchAsync(roads.deleteRoad));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(roads.renderEditForm));



module.exports = router;