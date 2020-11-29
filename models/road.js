const mongoose = require('mongoose');
//this helps shorten our code
const Schema = mongoose.Schema;

const RoadSchema = new Schema({
    title: String,
    rating: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Road', RoadSchema);