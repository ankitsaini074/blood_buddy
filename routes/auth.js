var express        = require("express"),
    router         = express.Router(),
    passport       = require("passport"),
    donor          = require("../models/donor"),
    hospital       = require("../models/hospital"),

    hospDatabase   =require("../models/hospDatabase"),
    middleware     =require("../middleware/index")
    LocalStrategy  = require("passport-local").Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    bodyParser     = require('body-parser'),
    multer         = require('multer'),
    path           = require('path');
    request        = require("request");

require('../config/passport')(passport);

router.use(express.static(__dirname + "/public"));
router.use(express.static(__dirname + "/public/scripts"));
router.use(express.static(__dirname + "/public/uploads"));
//app.use(express.static('/auth',__dirname + "/public"));
router.use(express.static(__dirname + "/views"));

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success     = req.flash('success');
    res.locals.error       = req.flash('error');
    next();
});

//Show register page
router.get('/register',function(req,res){
    res.render('register');
});
router.get('/registerHospital',function(req,res){
    res.render('registerHospital');
});
// Set multer storage 
const storage = multer.diskStorage({
    destination : './public/uploads',
    filename : function(req,file,cb){
         cb(
             null,file.fieldname + '-' + Date.now() + path.extname(file.originalname)
           );
    }
})

// Initialize upload
const upload = multer({
    storage : storage ,
    limits:{fileSize:10000000},
    fileFilter :(req,file,cb)=>{
        checkFileType(file,cb);
    }
}).single('profilePic');

//Check file type
function checkFileType(file,cb){
    //Allowed extension
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // check mime
    const mimetype = filetypes.test(file.mimetype);
    console.log(path.extname(file.originalname).toLowerCase());
    console.log(mimetype);
    if(mimetype && extname)
    {
        return cb(null,true);
    }
    else 
    {console.log(file);
    cb('Error : Images Only!');}
}



//Register Route
router.post('/register',(req,res,next)=>{
    upload(req,res,(err)=>{
        if(err)
        res.render('register',{msg: err});
        else 
        {
          if(req.file == undefined){
              res.render('register',{msg:'Error: No file selected!'});
          }
          else {
            next();
          }
        }
        
    })
   },
     passport.authenticate('local-signup', {
    successRedirect : '/profile', 
    failureRedirect : '/',
    failureFlash :true    
     })
);
    
router.post('/registerHospital',(req,res,next)=>{
    upload(req,res,(err)=>{
        if(err)
        res.render('registerHospital',{msg: err});
        else 
        {
          if(req.file == undefined){
              res.render('registerHospital',{msg:'Error: No file selected!'});
          }
          else {
            next();
          }
        }
        
    })
   },middleware.seed,
    passport.authenticate('local-signup-hospital', {
    successRedirect : '/profileHospital', 
    failureRedirect : '/',
    failureFlash :true    
})
);

//Show login form
router.get('/login', function(req, res){
    res.render('login'); 
 });
 router.get('/loginHospital', function(req, res){
    res.render('loginHospital'); 
 });
 
 //Login Route
router.post('/login', passport.authenticate('local-login', {
    successRedirect : '/home', 
    failureRedirect : '/home', 
    failureFlash :true
    
    
}));
router.post('/loginHospital', passport.authenticate('local-login-hospital', {
    successRedirect : '/home', 
    failureRedirect : '/home', 
    failureFlash :true
    
    
}));
router.get('/facebook', passport.authenticate('facebook', { 
    scope : ['public_profile', 'email']
}));


router.get('/facebook/callback',passport.authenticate('facebook', {
    successRedirect : '/profileFacebook',
    failureRedirect : '/'
}));

//Logout route
router.get("/logout", function(req, res){
    req.logout();
    //console.log("success", "LOGGED YOU OUT!");
//    req.flash("success", "LOGGED YOU OUT!");
    res.redirect("/");
 });

 module.exports = router;
