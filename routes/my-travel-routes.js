const express     = require('express');
const RouterModel = require('../models/route-model');
const passport    = require('passport');
const UserModel   = require('../models/user-model');

const router      = express.Router();

// MAKING A NEW ROUTE ---------------------------------
router.post('/api/myRoutes/new', (req, res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to create a route'});
    return;
  }

  const theRoute = new RouterModel({
    user: req.user._id,
    routeName: req.body.routeName,
    description: req.body.routeDescription,
    duration: req.body.routeDuration
  });

  UserModel.findByIdAndUpdate(req.user._id,
      {"$push" : {routes: theRoute._id},
    }, (err, question) => {
        if (err){
          console.log("Route not saved to user");
          next(err);
          return;
        }
  });
  
  theRoute.save((err) =>{
    if (err && theRoute.errors === undefined){
      res.status(500).json({ message: 'Route was not saved'});
      return;
    }

    if (err && theRoute.errors) {
      res.status(400).json({
        nameError: theRoute.errors.routeName,
        descriptionError: theRoute.errors.description,
        durationError: theRoute.errors.duration
       });
       return;
    }
    // Success!
    res.status(200).json(theRoute);
  });
});

// ACCESSING ALL ROUTES ----------------------------------
router.get('/api/myRoutes', (req,res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to see the Routes'});
    return;
  }
  RouterModel
    // only find the routes that belong to this user
    .find({user: req.user._id})
    // At the moment, the routes only have the ID of the user
    // populate is adding ALL the user information into this find result
    // Showing the user information without the encryptedPassword
    .populate('user', {encryptedPassword: 0})
    .exec((err, allTheRoutes)=>{
      if (err) {
        res.status(500).json({ message: 'Route find was not successful'});
        return;
      }
    res.status(200).json(allTheRoutes);
    });
});


module.exports = router;
