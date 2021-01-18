const express = require('express');
const router = express.Router();
const roads = require('../controllers/roads')
const catchAsync = require('../utilities/catchAsync');
const {isLoggedIn, validateRoad, isAuthor} = require('../middleware');
const Road = require('../models/road');
const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({storage});



//ROUTES===============================================================

router.route('/')
    .get(catchAsync(roads.index)) //roads.index function is now located in ../controllers/roads.js
    .post(isLoggedIn, upload.array('image'), validateRoad, catchAsync(roads.createRoad));
    

router.get('/new', isLoggedIn, roads.renderNewForm); //roads.renderNewForm function is now located in ../controllers/roads.js


router.route('/:id')
    .get(catchAsync(roads.showRoad))
    .put(isLoggedIn, isAuthor, validateRoad, catchAsync(roads.updateRoad))
    .delete(isLoggedIn, isAuthor, catchAsync(roads.deleteRoad));


router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(roads.renderEditForm));



module.exports = router;