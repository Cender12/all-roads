const mongoose = require('mongoose');
const cities = require('./cities')
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


const seedDB = async () => {
    await Road.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random10 = Math.floor(Math.random() * 10);
        const newCity = new Road({
            location: `${cities[random10].city}, ${cities[random10].state}`
        })
        await newCity.save();
    }
};

seedDB();