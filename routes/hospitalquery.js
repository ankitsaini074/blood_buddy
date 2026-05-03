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

router.post('/', async function(req, res){
    try {
        const user = await hospital.findOne({ 'local.username':req.body.username });
        res.render('profileHospitalTemp',{hospital:user});
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
