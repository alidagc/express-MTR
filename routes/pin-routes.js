const express     = require('express');
const passport    = require('passport');

const UserModel   = require('../models/user-model');
const RouteModel = require('../models/route-model');
const PinModel    = require('../models/pin-model');

const router      = express.Router();

// MAKE NEW PIN --------------------------------
router.post('/api/pins/newPin', (req, res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to create a pin'});
    return;
  }

  const thePin = new PinModel({
    routeId: req.body.pinRouteId,
    pinName: req.body.pinName,
    deets: req.body.pinDeets,
    duration: req.body.pinDuration,
    lat: req.body.pinLat,
    lng: req.body.pinLng
  });

  thePin.save((err) =>{
    if (err && thePin.errors === undefined){
      res.status(500).json({ message: 'Pin was not saved'});
      return;
    }
    if (err && thePin.errors) {
      console.log(thePin.errors);
      res.status(400).json({
        routeIdError: req.body.routeId,
        pinNameError: req.body.pinName,
        deetsError: req.body.deets,
        dirationError: req.body.duration,
        latError: req.body.lat,
        lngError: req.body.lng
       });
       return;
    }
    res.status(200).json(thePin);
  });
});

// ACCESSING ONE PIN----------------------------------
router.get('/api/pins/:pinId', (req,res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to see the Pin'});
    return;
  }
  PinModel.findById(req.params.pinId)
    .exec((err, thePin)=>{
      if (err) {
        res.status(500).json({ message: 'Pin find was not successful'});
        return;
      }
      console.log(thePin);
    res.status(200).json(thePin);
    });
});

// ACCESS ALL PINS ---------------------------------
router.get('/api/allpins/:routeId', (req,res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to see all pins'});
    return;
  }
  PinModel.find({routeId: req.params.routeId})
    .exec((err, allThePins)=>{
      if (err) {
        res.status(500).json({ message: 'Pins were not found successfully'});
        return;
      }
    res.status(200).json(allThePins);
    });
});

module.exports = router;
