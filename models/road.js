const mongoose = require('mongoose');
const Review = require('./review');
//this helps shorten our code
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
        url: String,
        filename: String   
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_250');
});

const RoadSchema = new Schema({
    title: String,
    images: [ImageSchema],
    rating: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

RoadSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Road', RoadSchema);