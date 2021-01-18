const Road = require('../models/road');

module.exports.index = async (req, res) => {
    const roadCollection = await Road.find({})
    res.render('roads/index', { roadCollection })
 }

 
 module.exports.renderNewForm = (req, res) => {
    res.render('roads/new');
}

module.exports.createRoad = async(req, res, next) => {
    const road = new Road (req.body.road);
    road.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    road.author = req.user._id;
    await road.save();
    console.log(road);
    req.flash('success', 'Successfully made a new road');
    res.redirect(`/Roads/${road._id}`) 
}

module.exports.showRoad = async (req, res) => {
    const road = await Road.findById(req.params.id).populate({
        path:'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!road){
        req.flash('error', 'Cannot find that road!');
        return res.redirect('/Roads');
    }
    res.render('roads/show', { road });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const road = await Road.findById(id);
    if(!road){
        req.flash('error', 'Cannot find that road!');
        return res.redirect('/Roads');
    }
    res.render('roads/edit', { road });
}

module.exports.updateRoad = async (req, res) => {
    const { id } = req.params;
    const road = await Road.findByIdAndUpdate(id, { ...req.body.road });
    req.flash('success','Successfully updated road!');
    res.redirect(`/Roads/${road._id}`);
}

module.exports.deleteRoad = async (req, res) => {
    const { id } = req.params;
    await Road.findByIdAndDelete(id);
    req.flash('success', 'Road deleted');
    res.redirect('/Roads');
}