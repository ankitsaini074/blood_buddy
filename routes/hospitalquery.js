var express        = require("express"),
    router         = express.Router(),
    passport       = require("passport"),
    donor          = require("../models/donor"),
    hospital       = require("../models/hospital"),
    LocalStrategy  = require("passport-local").Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    bodyParser     = require('body-parser'),
    multer         = require('multer'),
    path           = require('path');
    request        = require("request");

require('../config/passport')(passport);

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success     = req.flash('success');
    res.locals.error       = req.flash('error');
    next();
});


    router.post('/', function(req, res){
        hospital.findOne({ 'local.username':req.body.username }, function (err, user) {
            if (err)
                return done(err);
            else 
            res.render('profileHospitalTemp',{hospital:user});
           
    });
});



  module.exports = router;
