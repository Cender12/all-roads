const express = require('express');
const router = express.Router();
const roads = require('../controllers/roads')
const catchAsync = require('../utilities/catchAsync');
const {isLoggedIn, validateRoad, isAuthor} = require('../middleware');
const Road = require('../models/road');



//ROUTES===============================================================
router.get('/', catchAsync(roads.index)); //roads.index function is now located in ../controllers/roads.js

router.get('/new', isLoggedIn, roads.renderNewForm); //roads.renderNewForm function is now located in ../controllers/roads.js

router.post('/', isLoggedIn, validateRoad, catchAsync(roads.createRoad));

router.get('/:id', catchAsync(roads.showRoad));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(roads.renderEditForm));

router.put('/:id', isLoggedIn, isAuthor, validateRoad, catchAsync(roads.updateRoad));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(roads.deleteRoad));

module.exports = router;