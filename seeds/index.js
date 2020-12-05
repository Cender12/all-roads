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
        const newCity = new Road({
            location: `${cities[random50].city}, ${cities[random50].state}`,
            title:    `${sample(descriptors)} ${sample(places)}`
        })
        await newCity.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});