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
const mongoUri = 'mongodb://admin:admin123@ac-dtgapoa-shard-00-00.h884z07.mongodb.net:27017,ac-dtgapoa-shard-00-01.h884z07.mongodb.net:27017,ac-dtgapoa-shard-00-02.h884z07.mongodb.net:27017/?ssl=true&replicaSet=atlas-msf33r-shard-0&authSource=admin&appName=Cluster0'

mongoose.connect(mongoUri, {
    dbName: 'dbNew',
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000
})
    .then(async () => {
        console.log('MongoDB Connected Successfully');
        // Initialize counts after DB connection is established
        await countDonors(map);
    })
    .catch(err => {
        console.error('MongoDB Connection Error:', err.message);
    });
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
// countDonors(map) - Now called in MongoDB connection .then() block


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
app.get('/profileGoogle',function(req,res){
    res.render('profileGoogle',{donor : req.user});
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

app.post("/home/usernameTest", async function(req,res){
    try {
        const person = await donor.findOne({"local.username":req.body.username});
        if(person ==null)
            res.send({"username":"-1"});
        else res.send({"username":person.local.username});
    } catch (err) {
        console.error(err);
    }
});


app.post("/home/emailTest", async function(req,res){
  try {
    const person = await donor.findOne({"email":req.body.email});
    if(person ==null)
        res.send({"email":"-1"});
    else res.send({"email":person.email});
  } catch (err) {
    console.error(err);
  }
});


app.post("/home/hospitalUsernameTest", async function(req,res){
    try {
        const person = await hospital.findOne({"local.username":req.body.username});
        if(person ==null)
            res.send({"username":"-1"});
        else res.send({"username":person.local.username});
    } catch (err) {
        console.error(err);
    }
});


app.post("/home/hospitalEmailTest", async function(req,res){
  try {
    const person = await hospital.findOne({"email":req.body.email});
    if(person ==null)
        res.send({"email":"-1"});
    else res.send({"email":person.email});
  } catch (err) {
    console.error(err);
  }
});


app.get("/hospDatabase",middleware.isLoggedIn, async function(req,res){
    try {
        const data = await hospDatabase.findOne({"name":req.user.local.username});
        res.render('hospDatabase',{"data":data });
    } catch (err) {
        console.error(err);
    }
});


app.get("/editHospDatabase",middleware.isLoggedIn, async function(req,res){
    try {
        const data = await hospDatabase.findOne({"name":req.user.local.username});
        res.render('editHospDatabase',{"data":data });
    } catch (err) {
        console.error(err);
    }
});


app.post('/hospDatabaseForm',middleware.isLoggedIn,middleware.editHospData,function(req,res)
{
   res.redirect('/profileHospital');
});


app.listen(port,function(){
    console.log('Server Started');
});
