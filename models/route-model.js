const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const myRouteSchema = new Schema(
  {
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
  //ref is the string name of the model that the ID refers to
  // you NEED "ref" to use 'populate()' later
  routeName: { type: String, required: true},
  location: { type: String, required: true},
  description: { type: String, required: true},
  duration: { type: Number, min: 0.5, required: true},
  path: {type: Array},
  pins: {type: Schema.Types.ObjectId, ref: 'Pin'}
  // tags: {type: Array},
  },
  {
  timestamps: true
  }
);

const RouteModel = mongoose.model('Route', myRouteSchema);

module.exports = RouteModel;
