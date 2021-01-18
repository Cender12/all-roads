const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//THIS INFO IS HIDDEN IN ".ENV" FOLDER
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
})

const storage = new CloudinaryStorage({
    cloudinary, 
    folder: 'AllRoads',
    allowedFormats: ['jpeg', 'png', 'jpg'] 
});

module.exports = {
    cloudinary,
    storage
}