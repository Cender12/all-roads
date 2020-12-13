const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
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

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))


//ROUTES===================================================================================
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/Roads', async (req, res) => {
   const roadCollection = await Road.find({});
   res.render('roads/index', { roadCollection })
});

app.get('/Roads/new', (req, res) => {
    res.render('roads/new')
})

app.post('/Roads', async(req, res) => {
    const road = new Road (req.body.road);
    await road.save();
    res.redirect(`/Roads/${road._id}`)
})

app.get('/Roads/:id', async (req, res) => {
    const road = await Road.findById(req.params.id)
    res.render('roads/show', { road });
});

app.get('/Roads/:id/edit', async(req, res) => {
    const road = await Road.findById(req.params.id)
    res.render('roads/edit', { road });
})

app.put('/Roads/:id', async (req, res) => {
    const { id } = req.params;
    const road = await Road.findByIdAndUpdate(id, { ...req.body.road })
    res.redirect(`/Roads/${road._id}`)
})

app.delete('/Roads/:id', async (req, res) => {
    const { id } = req.params;
    await Road.findByIdAndDelete(id);
    res.redirect('/Roads');
})



//PORT LISTENER============================================================================
app.listen(3000, () =>{
    console.log('Serving on port 3000...');
})
