const express     = require('express');
const RouteModel = require('../models/route-model');
const passport    = require('passport');
const UserModel   = require('../models/user-model');

const router      = express.Router();

// MAKING A NEW ROUTE ---------------------------------
router.post('/api/myRoutes/new', (req, res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to create a route'});
    return;
  }

  const theRoute = new RouteModel({
    user: req.user._id,
    routeName: req.body.routeName,
    location: req.body.routeLocation,
    description: req.body.routeDescription,
    duration: req.body.routeDuration,
    tags: req.body.routeTags,
    pins: req.body.routePins,
    path: req.body.routePath
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
    // Put the full user info here for Angular
    // theRoute.user = req.user;
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
  RouteModel.find({user: req.user._id})
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

// ACCESSING ONE ROUTE----------------------------------
router.get('/api/:id', (req,res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to see the Routes'});
    return;
  }
  RouteModel.findById(req.params.id)
    // At the moment, the routes only have the ID of the user
    // populate is adding ALL the user information into this find result
    // Showing the user information without the encryptedPassword
    .exec((err, theRoute)=>{
      if (err) {
        res.status(500).json({ message: 'Route find was not successful'});
        return;
      }
      console.log(theRoute);
    res.status(200).json(theRoute);
    });
});

// EDIT A ROUTE-----------------------------------------
router.post('/api/:id/edit', (req, res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to edit this route'});
    return;
  }
  RouteModel.findByIdAndUpdate(req.params.id,
    {$set: {
      user: req.user._id,
      routeName: req.body.routeName,
      location: req.body.routeLocation,
      description: req.body.routeDescription,
      duration: req.body.routeDuration,
      tags: req.body.routeTags,
    }},
     (err) => {
      if (err) {
        next(err);
        return;
    }
  });

  RouteModel.save((err) =>{
    if (err && theRoute.errors === undefined){
      res.status(500).json({ message: 'Route was not updated'});
      return;
    }

    res.status(200).json(theRoute);
  });
});


// DELETING ONE ROUTE ----------------------------------
router.delete('/api/:id/delete', (req,res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to delete this Route'});
    return;
  }

  const index = req.user.routes.indexOf(req.params.id);
  req.user.routes.splice(index, 1);

  req.user.save((err, route) => {
    if (err) {
      next(err);
      return;
    }
  });

  RouteModel.findByIdAndRemove(req.params.id)
    .exec((err, theRoute)=>{
      if (err) {
        res.status(500).json({ message: 'Route was not deleted successfully'});
        return;
      }
    });

});



module.exports = router;
