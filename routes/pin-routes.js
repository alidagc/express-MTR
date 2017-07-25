const express     = require('express');
const passport    = require('passport');

const UserModel   = require('../models/user-model');
const RouteModel = require('../models/route-model');
const PinModel    = require('../models/pin-model');

const router      = express.Router();

// NEW PIN --------------------------------
router.post('/api/myRoutes/newPin', (req, res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to create a pin'});
    return;
  }

  const thePin = new PinModel({
    // routeId: req.body.pinRouteId, //how do i get the URL from the myRoute from the Angular Url
    pinName: req.body.pinName,
    duration: req.body.pinDuration,
    imageUrl: req.body.pinImageUrl,
    notes: req.body.pinNotes
  });

  thePin.save((err) =>{
    if (err && thePin.errors === undefined){
      res.status(500).json({ message: 'Pin was not saved'});
      return;
    }

    if (err && thePin.errors) {
      res.status(400).json({
        pinNameError: req.body.pinName,
        durationError: req.body.duration,
        imageUrlError: req.body.imageUrl,
        notesError: req.body.notes
       });
       return;
    }
    // Success!
    res.status(200).json(thePin);
  });
});


module.exports = router;
