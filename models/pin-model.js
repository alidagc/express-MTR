const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myPinSchema = new Schema(
  {
  routeId: { type: Schema.Types.ObjectId, required: true, ref: 'Route'},
  pinName: { type: String, required: true},
  deets: {type: String, required: true},
  duration: { type: Number, required: true},
  lat: {type: Number, required: true},
  lng: {type: Number, required: true}
  },
  {
  timestamps: true
  }
);

const PinModel = mongoose.model('Pin', myPinSchema);

module.exports = PinModel;
