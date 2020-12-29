const mongoose = require('mongoose');
//this helps shorten our code
const Schema = mongoose.Schema;

const RoadSchema = new Schema({
    title: String,
    image: String,
    rating: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Road', RoadSchema);