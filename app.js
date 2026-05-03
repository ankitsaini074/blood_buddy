// ===================== IMPORTS =====================
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require("cookie-parser");
const session = require('express-session');
const flash = require('connect-flash');
const hashmap = require('hashmap');
const path = require('path');

// Models
const donor = require('./models/donor.js');
const hospital = require('./models/hospital.js');
const hospDatabase = require('./models/hospDatabase.js');

// Middleware & utils
const middleware = require('./middleware/index');
const countDonors = require('./count.js');

// Passport config
require('./config/passport')(passport);

// Routes
const authRoutes = require("./routes/auth");
const editRoutes = require("./routes/edit");
const searchRoutes = require("./routes/search");
const searchHospRoutes = require("./routes/searchHospital");
const editHospRoutes = require("./routes/editHospital");
const hospQuery = require("./routes/hospitalquery");

// ===================== CONFIG =====================
const port = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.use(session({
    secret: 'asecretmessage',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// ===================== 🔥 MONGODB CONNECTION (FIXED) =====================

// ✅ NON-SRV connection string (NO DNS issues)
const mongoUri = "mongodb://admin:admin123@ac-dtgapoa-shard-00-00.h884z07.mongodb.net:27017,ac-dtgapoa-shard-00-01.h884z07.mongodb.net:27017,ac-dtgapoa-shard-00-02.h884z07.mongodb.net:27017/dbNew?ssl=true&replicaSet=atlas-msf33r-shard-0&authSource=admin&retryWrites=true&w=majority";

// Mongoose config
mongoose.set('strictQuery', false);

// Debug events
mongoose.connection.on('connecting', () => console.log('MongoDB connecting...'));
mongoose.connection.on('connected', () => console.log('MongoDB connected'));
mongoose.connection.on('error', err => console.error('MongoDB error:', err));
mongoose.connection.on('disconnected', () => console.log('MongoDB disconnected'));

// Count map
var map = new hashmap();
map.set("A1+", 0);
map.set("A1-", 0);
map.set("A2+", 0);
map.set("A2-", 0);
map.set("B+", 0);
map.set("B-", 0);
map.set("A1B+", 0);
map.set("A1B-", 0);
map.set("A2B+", 0);
map.set("A2B-", 0);
map.set("AB+", 0);
map.set("AB-", 0);
map.set("O+", 0);
map.set("O-", 0);
map.set("A+", 0);
map.set("A-", 0);
map.set("hospcount", 0);
map.set("donorcount", 0);

// Connect DB
async function connectDB() {
    try {
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000
        });

        console.log('✅ MongoDB Connected Successfully');

        // Run after DB connection
        await countDonors(map);

    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
        process.exit(1);
    }
}

connectDB();

// ===================== ROUTES =====================

app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/edit", editRoutes);
app.use("/hospitalquery", hospQuery);
app.use("/searchHospital", searchHospRoutes);
app.use("/editHospital", editHospRoutes);

// Pages
app.get('/', (req, res) => res.render('home'));
app.get('/home', (req, res) => res.render('home'));
app.get('/tempHome', (req, res) => res.render('home'));

app.get('/profile', middleware.isLoggedIn, (req, res) => {
    res.render('profile', { donor: req.user });
});

app.get('/profileHospital', middleware.isLoggedIn, (req, res) => {
    res.render('profileHospital', { hospital: req.user });
});

// ===================== API =====================

app.post("/home/usernameTest", async (req, res) => {
    try {
        const person = await donor.findOne({ "local.username": req.body.username });
        res.send({ username: person ? person.local.username : "-1" });
    } catch (err) {
        console.error(err);
    }
});

app.post("/home/emailTest", async (req, res) => {
    try {
        const person = await donor.findOne({ email: req.body.email });
        res.send({ email: person ? person.email : "-1" });
    } catch (err) {
        console.error(err);
    }
});

// ===================== SERVER =====================
app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`);
});