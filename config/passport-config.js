const passport      = require('passport');
const LocalStrategy  = require('passport-local').Strategy;
const bcrypt        = require('bcrypt');
const UserModel     = require('../models/user-model');

// Save the user's ID in the "bowl"
passport.serializeUser((userFromDB, next) => {
  next(null, userFromDB._id);
});

//Retrieve the user's info from the DB with the ID inside the bowl
passport.deserializeUser((idFromBowl, next) => {
  UserModel.findById(
    idFromBowl,
    (err, userFromDB) => {
    if (err) {
      next(err);
      return;
    }
    next(null, userFromDB);
  });
});

// email & password login Strategy
passport.use(new LocalStrategy(
  {
    //left side is set by passport (cant change) and the right is the name used to connect with angular
    // when you login and or test in insomnia, this is what you use
    usernameField: 'userEmail',
    passwordField: 'userPassword'
  },
  (theEmail, thePassword, next) => {

    UserModel.findOne(
      { email: theEmail },
      (err, userFromDB) => {
      if (err) {
        next(err);
        return;
      }

      if (!userFromDB) {
        next(null, false, { message: 'Email not found, please try again or sign up for a new account' });
        return;
      }

      if (!bcrypt.compareSync(thePassword, userFromDB.encryptedPassword)) {
        next(null, false, { message: 'Incorrect password' });
        return;
      }

      next(null, userFromDB);

    }); // close UserModel.findOne
  } // close (theEmail, thePassword, next) => {
)); // close passport strategy
