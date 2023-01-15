//Importing modules
var express               = require('express'),
    app                   = express(),
    mongoose              = require('mongoose'),
    bodyParser            = require('body-parser'),
    passport              = require('passport'),
    LocalStrategy         = require("passport-local").Strategy,
    cookieParser          = require("cookie-parser"),
    session               = require('express-session'),
    flash                 = require('connect-flash'),
    donor                 = require('./models/donor.js'),
    hospital              = require('./models/hospital.js'),
    middleware            = require('./middleware/index'),
    multer                = require('multer'),
    countDonors           = require('./count.js'),
    hashmap               = require('hashmap'),
    hospDatabase          = require('./models/hospDatabase.js'),
    path                  = require('path');

    
    require('./config/passport')(passport);

//Requiring routes
var authRoutes    = require("./routes/auth"),
    editRoutes    = require("./routes/edit"),
    searchRoutes  = require("./routes/search"),
    searchHospRoutes  = require("./routes/searchHospital"),
    editHospRoutes= require("./routes/editHospital");
    hospQuery = require("./routes/hospitalquery");
const port=process.env.PORT || 8080;
 
//Connecting database
 mongoose.connect('mongodb+srv://admin:admin123@cluster0.57b0zee.mongodb.net/ankitsaini257?retryWrites=true&w=majority', {useNewUrlParser: true});
//mongoose.connect('mongodb://localhost:27017/blood', {useNewUrlParser: true});





//Configuration
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false})); 
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.use(session({
    secret: 'asecretmessage',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

//Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/edit", editRoutes);
app.use("/hospitalquery",hospQuery);
app.use("/searchHospital", searchHospRoutes);
app.use("/editHospital", editHospRoutes);
app.use("/hospitalquery",hospQuery);
//count map
var map=new hashmap();
map.set("A1+",0);
map.set("A1-",0);
map.set("A2+",0);
map.set("A2-",0);
map.set("B+",0);
map.set("B-",0);
map.set("A1B+",0);
map.set("A1B-",0);
map.set("A2B+",0);
map.set("A2B-",0);
map.set("AB+",0);
map.set("AB-",0);
map.set("O+",0);
map.set("O-",0);
map.set("A+",0);
map.set("A-",0);
map.set("hospcount",0);
map.set("donorcount",0);
countDonors(map);


//ROUTES
app.get('/',function(req,res){
    res.render('home');
});
app.get('/tempHome',function(req,res){
    res.render('home');
});
app.get('/home',function(req,res){
    res.render('home');
});
app.get('/profile',middleware.isLoggedIn,function(req,res){
    res.render('profile',{donor : req.user});
});
app.get('/profileFacebook',function(req,res){
    res.render('profileFacebook',{donor : req.user});
});
app.get('/profileHospital',middleware.isLoggedIn,function(req,res){
    console.log("hosp login");
    res.render('profileHospital',{hospital : req.user});
});
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
app.get('/auth/google/callback',
        passport.authenticate('google', {
                successRedirect : '/profileGoogle',
                failureRedirect : '/'
        }));

app.post("/home/usernameTest",function(req,res){
    var query= donor.findOne({"local.username":req.body.username});
 query.select("local.username");
 query.exec(function (err, person) {
   if (err) return handleError(err);     
   if(person ==null)
   res.send({"username":"-1"});
   else res.send({"username":person.local.username});
});
});


app.post("/home/emailTest",function(req,res){
  var query= donor.findOne({"email":req.body.email});
query.select("email");
query.exec(function (err, person) {
 if (err) return handleError(err);     
 if(person ==null)
 res.send({"email":"-1"});
 else res.send({"email":person.email});
});
});


app.post("/home/hospitalUsernameTest",function(req,res){
    var query= hospital.findOne({"local.username":req.body.username});
 query.select("local.username");
 query.exec(function (err, person) {
   if (err) return handleError(err);     
   if(person ==null)
   res.send({"username":"-1"});
   else res.send({"username":person.local.username});
});
});


app.post("/home/hospitalEmailTest",function(req,res){
  var query= hospital.findOne({"email":req.body.email});
query.select("email");
query.exec(function (err, person) {
 if (err) return handleError(err);     
 if(person ==null)
 res.send({"email":"-1"});
 else res.send({"email":person.email});

 //console.log(person.email);

});
});


app.get("/hospDatabase",middleware.isLoggedIn,function(req,res){

var database=hospDatabase.findOne({"name":req.user.local.username}).select();
database.exec(function (err, data) {
    if (err) return handleError(err);     
    res.render('hospDatabase',{"data":data });
   });

    
});


app.get("/editHospDatabase",middleware.isLoggedIn,function(req,res){

    var database=hospDatabase.findOne({"name":req.user.local.username}).select();
    database.exec(function (err, data) {
        if (err) return handleError(err);     
        res.render('editHospDatabase',{"data":data });
       });

});


app.post('/hospDatabaseForm',middleware.isLoggedIn,middleware.editHospData,function(req,res)
{
   res.redirect('/profileHospital');
});


app.listen(port,function(){
    console.log('Server Started');
});
