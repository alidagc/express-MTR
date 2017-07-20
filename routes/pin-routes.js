const express     = require('express');
const PinModel    = require('../models/pin-model');
const passport    = require('passport');
const UserModel   = require('../models/user-model');

const router      = express.Router();

router.post('/api/myRoutes/new', (req, res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to create a pin'});
    return;
  }

  const thePin = new PinModel({
    // user: req.user._id,
    // routeName: req.body.routeName,
    // description: req.body.routeDescription,
    // duration: req.body.routeDuration
  });

  thePin.save((err) =>{
    if (err && thePin.errors === undefined){
      res.status(500).json({ message: 'Pin was not saved'});
      return;
    }

    if (err && thePin.errors) {
      res.status(400).json({
        // nameError: theRoute.errors.routeName,
        // descriptionError: theRoute.errors.description,
        // durationError: theRoute.errors.duration
       });
       return;
    }
    // Success!
    res.status(200).json(thePin);
  });
});


module.exports = router;
