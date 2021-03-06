const express     = require('express');
const bcrypt      = require('bcrypt');
const passport    = require('passport');

const UserModel   = require('../models/user-model');

const router      = express.Router();

// POST signup
router.post('/api/signup', (req, res, next) =>{
  if(!req.body.signupEmail || !req.body.signupPassword) {
    // status 400 helps the front end know about about the error - uses the catch in ng. 400 is user error.
    res.status(400).json({message: 'Need both email and password'});
    return;
  }
// once email is entered, look for it in the DB
  UserModel.findOne(
    {email: req.body.signupEmail},
    (err, userFromDb) => {
      // Status 500 means our server messed up
        if (err){
          res.status(500).json({ message: 'Cannot verify your email at the moment. Please try again later.'});
          return;
        }
      // if is found, (since we are on singup) this results in error
        if (userFromDb){
          res.status(400).json({ message: 'Email already exists'});
          return;
        }

      const salt = bcrypt.genSaltSync(10);
      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

      const theUser = new UserModel ({
        // these are the data points that angular send to send back to us
        firstName: req.body.signupFirstName,
        lastName: req.body.signupLastName,
        email: req.body.signupEmail,
        encryptedPassword: scrambledPassword
      });

      theUser.save((err)=>{
        if (err){
          res.status(500).json({ message: 'Cannot create your account. Please try again later.'});
          return;
        }
        // Automatically logs them in after the sign up
        // (req.login() is defined by passport)
        req.login(theUser, (err)=>{
          if (err) {
            res.status(500).json({ message: 'Login cannot be completed'});
            return;
          }
        // Remove the encryptedPassword before sending
        // (not from the database, just from the object)
        theUser.encryptedPassword = undefined;

        // Send the use's information to the fronEnd
        res.status(200).json(theUser);
      }); // close req.login()
    }); // close theUser.save()
  }); // close UserModel.findOne()
}); // close router.post('/signup')

// POST login

// Not using passport.authenticate() because that redirects
router.post('/api/login', (req, res, next) =>{
  const authenticateFunction = passport.authenticate('local',(err, theUser, extraInfo) =>{
    if (err){
      res.status(500).json({ message: 'Unknown login error'});
      return;
    }
    //Login failed for sure if theUser is empty
    if (!theUser){
    // extraInfo contains the feedback message from LocalStrategy
      res.status(401).json(extraInfo);
      return;
    }
    //login successful
    req.login(theUser, (err) => {
      if (err){
        res.status(500).json({ message: 'Session save error'});
        return;
      }

      theUser.encryptedPassword = undefined;
      // Everything worked!
      res.status(200).json(theUser);
    });
  });

  authenticateFunction(req, res, next);
});

// POST logout
router.post('/api/logout', (req, res, next)=>{
  // req.logout() is defined by passport
  req.logout();
  res.status(200).json({ message: 'Log out success'});
});

// GET checklogin
router.get('/api/checklogin', (req, res, next)=>{
  if(!req.user) {
    res.status(401).json({ message: 'No user logged in'});
    return;
  }

  req.user.encryptedPassword = undefined;
  res.status(200).json(req.user);
});


module.exports = router;
