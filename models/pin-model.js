const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myPinSchema = new Schema(
  {
  routeId: { type: Schema.Types.ObjectId, required: true, ref: 'Route'},
  pinName: { type: String, required: true},
  location: { type: String, required: true},
  duration: { type: Number, required: true},
  image: { type: String, required: true},
  notes: {type: String}
  },
  {
  timestamps: true
  }
);

const PinModel = mongoose.model('Pin', myPinSchema);

module.exports = PinModel;
