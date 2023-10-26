const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema=new mongoose.Schema({
    Photos:[String]
})



module.exports = Image = mongoose.model('Image', ImageSchema);

