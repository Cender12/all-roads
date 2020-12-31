const { number } = require('joi');
const Joi = require('joi');

module.exports.RoadSchema = Joi.object({
    road: Joi.object({
        title: Joi.string().required(),
        rating: Joi.number().required().min(0).max(5),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required()
    }).required()
});

