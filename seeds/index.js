const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers');
const Road = require('../models/road');

mongoose.connect('mongodb://localhost:27017/all-roads',{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Road.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random50 = Math.floor(Math.random() * 50);
        const rating = Math.floor(Math.random() * (5 - 1 + 1)) + 1;
        const newCity = new Road({
            //YOUR USER ID
            author: '5ff3c754585f7303e7067bed',
            location:       `${cities[random50].city}, ${cities[random50].state}`,
            title:          `${sample(descriptors)} ${sample(places)}`,
            description:    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
            rating,
            geometry: { 
                type: 'Point', 
                coordinates: [
                    cities[random50].longitude,
                    cities[random50].latitude,
                ] 
            },
            images: [ 
                { 
                    url:
                    'https://res.cloudinary.com/cender12/image/upload/v1611002638/AllRoads/ri8ku6jsbwhfuqjkzvdo.jpg',
                    filename: 'AllRoads/ri8ku6jsbwhfuqjkzvdo' 
                },
                { 
                    url:
                    'https://res.cloudinary.com/cender12/image/upload/v1611002639/AllRoads/xewgee3vlefgsww8arsw.jpg',
                    filename: 'AllRoads/xewgee3vlefgsww8arsw' 
                } 
            ]
        })
        await newCity.save();
    }
};

// collection id:
// 273760

seedDB().then(() => {
    mongoose.connection.close();
});