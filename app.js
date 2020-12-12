const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Road = require('./models/road');

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

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('home');
})

app.get('/Roads', async (req, res) => {
   const roadCollection = await Road.find({});
   res.render('roads/index', { roadCollection })
})

app.get('/Roads/:id', async (req, res) => {
    const road = await Road.findById(req.params.id)
    res.render('roads/show', { road });
})





app.listen(3000, () =>{
    console.log('Serving on port 3000...');
})
