const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myPinSchema = new Schema(
  {
  routeId: { type: Schema.Types.ObjectId, required: true, ref: 'Route'},
  pinName: { type: String, required: true},
  duration: { type: Number, required: true},
  imageUrl: { type: String},
  notes: {type: String, required: true},
  //location has the lat and lng to redraw on map
  location: {type: Object, rquired: true}
  },
  {
  timestamps: true
  }
);

const PinModel = mongoose.model('Pin', myPinSchema);

module.exports = PinModel;
