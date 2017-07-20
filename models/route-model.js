const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const myRouteSchema = new Schema(
  {
  user: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
  //ref is the string name of the model that the ID refers to
  // you NEED "ref" to use 'populate()' later
  routeName: { type: String, required: true},
  description: { type: String, required: true},
  duration: { type: Number, min: 1, required: true},
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
