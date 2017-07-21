const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myUserSchema = new Schema(
  {
  firstName: { type: String, required: true},
  lastName: { type: String, required: true},
  email: { type: String, required: true},
  encryptedPassword: { type: String, required: true},
  routes: { type: [Schema.Types.ObjectId], ref: 'Route'},
  },
  {
  timestamps: true
  }
);

const UserModel = mongoose.model('User', myUserSchema);

module.exports = UserModel;
