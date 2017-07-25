const express     = require('express');
const passport    = require('passport');

const UserModel   = require('../models/user-model');
const RouteModel  = require('../models/route-model');
const PinModel    = require('../models/pin-model');

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
    pins: req.body.routePins,
    path: req.body.routePath
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
    .exec((err, allTheRoutes)=>{
      if (err) {
        res.status(500).json({ message: 'Route find was not successful'});
        return;
      }
    res.status(200).json(allTheRoutes);
    });
});

// ACCESSING ONE ROUTE----------------------------------
router.get('/api/:routeId', (req,res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to see the Routes'});
    return;
  }
  RouteModel.findById(req.params.routeId)
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
router.put('/api/:routeId/edit', (req, res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to edit this route'});
    return;
  }
  RouteModel.findByIdAndUpdate(req.params.routeId,
    {$set: {
      routeName: req.body.routeName,
      location: req.body.routeLocation,
      description: req.body.routeDescription,
      duration: req.body.routeDuration
    }},
    { new: true },
     (err, theRoute) => {
      if (err) {
        // next(err);
        console.log(err);
        res.status(500).json({ message: 'Route was not updated'});
        return;
    }
      res.status(200).json(theRoute);
  });
});


// DELETING ONE ROUTE ----------------------------------
router.delete('/api/:routeId/delete', (req,res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to delete this Route'});
    return;
  }

  RouteModel.findByIdAndRemove(req.params.routeId)
    .exec((err, theRoute)=>{
      if (err) {
        res.status(500).json({ message: 'Route was not deleted successfully'});
        return;
      }
    });
});

// ADDING A PATH ------------------------------------
router.post('/api/:routeId/newpath', (req, res, next)=>{
  if (!req.user){
    res.status(401).json({ message: 'Log in to create a path'});
    return;
  }
  RouteModel.findByIdAndUpdate(req.params.routeId,
    {$set: {
      path: req.body.pathArray
    }},
    { new: true },
     (err, theRoute) => {
      if (err) {
        res.status(500).json({ message: 'Path was not created successfully'});
        return;
    }
    res.status(200).json(theRoute);
  });
});



module.exports = router;
