const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myRouteSchema = new Schema(
  {
  user: { type: String, required: true},
  routeName: { type: String, required: true},
  description: { type: String, required: true},
  duration: { type: Number, required: true},
  tags: {type: Array},
  pins: {type: Array},
  path: {type: Array}
  },
  {
  timestamps: true
  }
);

const RouteModel = mongoose.model('Route', myRouteSchema);

module.exports = RouteModel;
