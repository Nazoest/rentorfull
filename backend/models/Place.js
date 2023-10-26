const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');


const placeSchema = new mongoose.Schema({
 /*  owner: {type:mongoose.Schema.Types.ObjectId,
     ref:'User'}, */
  title: {
  type:String,
  unique:true
  },
  address: String,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  maxGuests: Number,
  price: Number,
  _id: {
    type: String, 
    default: uuidv4
}
});

const PlaceModel = mongoose.model('Place', placeSchema);

module.exports = PlaceModel;