// ===================== IMPORTS =====================
require('dotenv').config();
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
const adminRoutes = require("./routes/admin");
const requestRoutes = require("./routes/requests");
const campRoutes = require("./routes/camps");
const hospitalNeedsRoutes = require("./routes/hospitalNeeds");
const Request = require('./models/request');
const Camp = require('./models/camp');
const HospitalRequest = require('./models/hospitalRequest');

// ===================== CONFIG =====================
const port = process.env.PORT || 5000;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));

app.use(session({
    secret: process.env.SESSION_SECRET || 'asecretmessage',
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

require('https').get('https://api.ipify.org', res => {
  res.on('data', ip => console.log("Render IP:", ip.toString()));
});

// ===================== 🔥 MONGODB CONNECTION (FIXED) =====================

// ✅ Use environment variable for MongoDB URI
const mongoUri = process.env.MONGODB_URI;
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
        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 30000,
            tls: true,
            tlsAllowInvalidCertificates: false,
        });
        console.log('✅ MongoDB Connected Successfully');
        await countDonors(map);
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err);
    }
}

connectDB();

// ===================== ROUTES =====================

app.use("/admin", adminRoutes);
app.use("/requests", requestRoutes);
app.use("/camps", campRoutes);
app.use("/hospital-needs", hospitalNeedsRoutes);
app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use("/edit", editRoutes);
app.use("/hospitalquery", hospQuery);
app.use("/searchHospital", searchHospRoutes);
app.use("/editHospital", editHospRoutes);

// Pages
async function renderHome(req, res) {
    try {
        const [urgentRequests, upcomingCamps, topHospNeeds] = await Promise.all([
            Request.find({ status: 'open', urgency: { $in: ['critical', 'urgent'] } })
                .sort({ urgency: 1, createdAt: -1 }).limit(5).lean(),
            Camp.find({ status: 'upcoming', date: { $gte: new Date() } })
                .sort({ date: 1 }).limit(3).lean(),
            HospitalRequest.find({ status: 'open', urgency: { $in: ['critical', 'urgent'] } })
                .sort({ urgency: 1, createdAt: -1 }).limit(4).lean()
        ]);
        res.render('home', { urgentRequests, upcomingCamps, topHospNeeds });
    } catch (err) {
        res.render('home', { urgentRequests: [], upcomingCamps: [], topHospNeeds: [] });
    }
}
app.get('/', renderHome);
app.get('/home', renderHome);
app.get('/tempHome', renderHome);

app.get('/profile', middleware.isLoggedIn, (req, res) => {
    res.render('profile', { donor: req.user });
});

app.get('/profileHospital', middleware.isLoggedIn, async (req, res) => {
    try {
        const username = req.user.local && req.user.local.username;
        const [myCamps, myNeeds] = await Promise.all([
            Camp.find({ organizerUsername: username }).sort({ date: -1 }).lean(),
            HospitalRequest.find({ hospitalUsername: username }).sort({ createdAt: -1 }).lean()
        ]);
        res.render('profileHospital', { hospital: req.user, myCamps, myNeeds });
    } catch (err) {
        res.render('profileHospital', { hospital: req.user, myCamps: [], myNeeds: [] });
    }
});

// Hospital Database Routes
app.get('/hospDatabase', middleware.isLoggedIn, async (req, res) => {
    try {
        const username = req.user.local && req.user.local.username;
        let data = await hospDatabase.findOne({ name: username }).lean();
        if (!data) {
            // Initialize with zeros if no record exists
            data = {
                A1: '0', A1_: '0', A2: '0', A2_: '0',
                A: '0', A_: '0', B: '0', B_: '0',
                AB: '0', AB_: '0', O: '0', O_: '0',
                A1B: '0', A1B_: '0', A2B: '0', A2B_: '0'
            };
        }
        res.render('hospDatabase', { data });
    } catch (err) {
        console.error(err);
        res.render('hospDatabase', { data: {} });
    }
});

app.get('/editHospDatabase', middleware.isLoggedIn, async (req, res) => {
    try {
        const username = req.user.local && req.user.local.username;
        let data = await hospDatabase.findOne({ name: username }).lean();
        if (!data) {
            // Initialize with zeros if no record exists
            data = {
                A1: '0', A1_: '0', A2: '0', A2_: '0',
                A: '0', A_: '0', B: '0', B_: '0',
                AB: '0', AB_: '0', O: '0', O_: '0',
                A1B: '0', A1B_: '0', A2B: '0', A2B_: '0'
            };
        }
        res.render('editHospDatabase', { data });
    } catch (err) {
        console.error(err);
        res.render('editHospDatabase', { data: {} });
    }
});

app.post('/hospDatabaseForm', middleware.isLoggedIn, middleware.editHospData, (req, res) => {
    req.flash('success', 'Blood inventory updated successfully!');
    res.redirect('/hospDatabase');
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