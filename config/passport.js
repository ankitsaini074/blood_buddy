var LocalStrategy   = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    donor           = require('../models/donor'),
    hospital        = require('../models/hospital'),
    flash           = require('connect-flash');
    configAuth = require('./auth');
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
module.exports = function(passport) {

    //Serializing User for the session
passport.serializeUser(function(user, done) {              //changed

    if(user.userType==="Donor")
    {
        var key1="a"+user.id;
        done(null,key1);
    }
    else if(user.userType==="Hospital")
    done(null,"b"+user.id);
});
passport.deserializeUser(async function(key, done) {
    try {
        if(key.charAt(0)==="a")
        {
            const donors = await donor.findById(key.substr(1));
            done(null, donors);
        }
        else if(key.charAt(0)==="b")
        {
            const hospitals = await hospital.findById(key.substr(1));
            done(null, hospitals);
        }
    } catch (err) {
        done(err, null);
    }
});


//Local Strategy for Register
passport.use('local-signup', new LocalStrategy({passReqToCallback : true},async function(req, username, password, done){
    try {
        console.log('Attempting to register user:', username);
        console.log('Request body keys:', Object.keys(req.body));
        console.log('File:', req.file ? req.file.filename : 'No file');

        // Validate eligibility criteria - all 9 must be checked
        for (let i = 1; i <= 9; i++) {
            if (!req.body['chk' + i]) {
                console.log('Eligibility check failed for chk' + i);
                return done(null, false, req.flash('error', 'Please accept all Eligibility Criteria before registering.'));
            }
        }

        // Validate confirmation checkbox
        if (!req.body.activeStatus) {
            console.log('Active status checkbox not checked');
            return done(null, false, req.flash('error', 'Please confirm that you meet the eligibility criteria.'));
        }

        // Validate terms checkbox
        if (!req.body.terms) {
            console.log('Terms checkbox not checked');
            return done(null, false, req.flash('error', 'Please accept the Terms of Service and Privacy Policy.'));
        }

        const user = await donor.findOne({ 'local.username':username });
        if (user){
            console.log("User exists already");
             return done(null, false,req.flash("error", 'This Username is already taken.'));
        }

        var newDonor  = new donor();
        donor.collection.dropIndex({"username":1});
        newDonor.local.username    = username;
        newDonor.local.password = newDonor.generateHash(password);
        newDonor.name = req.body.name;
        newDonor.email = req.body.email;
        newDonor.dob = req.body.dob;
        newDonor.profilePic = req.file.filename;
        newDonor.gender = req.body.gender;
        newDonor.bloodGroup = req.body.bloodGroup;
        newDonor.dateOfLastDonation = req.body.dateOfLastDonation;
        newDonor.city = req.body.city;
        newDonor.activeStatus = req.body.activeStatus;
        newDonor.contactNumber = req.body.contactNumber;
        newDonor.address = req.body.address;
        newDonor.userType= "Donor"

        const created = await newDonor.save();
        console.log("Registered Successfully!");
        console.log("hi " + created.name);
        return done(null, newDonor,req.flash("success", "Successfully Signed Up! Welcome " + req.body.username));
    } catch (err) {
        console.error('Registration error:', err);
        return done(err);
    }
}));
//Local Strategy for Register Hospitals
passport.use('local-signup-hospital', new LocalStrategy({ passReqToCallback: true }, async function (req, username, password, done) {
    try {
        // Validate terms checkbox
        if (!req.body.agreeTerms) {
            return done(null, false, req.flash('error', 'Please accept the Terms of Service and Privacy Policy.'));
        }

        const user = await hospital.findOne({ 'local.username': username });
        if (user) {
            console.log("User exists already");
            return done(null, false, req.flash('error', 'This Username is already taken.'));
        }

        var newHospital = new hospital();
        // newHospital._id= req.body._id;
        hospital.collection.dropIndex({"username":1});                      //insert this
        newHospital.local.username = username;
        newHospital.local.password = newHospital.generateHash(password);
        newHospital.name = req.body.name;
        newHospital.email = req.body.email;
        newHospital.profilePic = req.file.filename ;
       // newHospital.confirmPassword = req.body.confirmPassword;
        newHospital.city = req.body.city;
        newHospital.contactNumber = req.body.contactNumber;
        newHospital.address = req.body.address;
        newHospital.userType= "Hospital";                            //changed

        const created = await newHospital.save();
        console.log("Registered Successfully!");
        console.log("Welcome  " + created.name);
        return done(null, newHospital, req.flash("success", "Successfully Signed Up! Welcome " + req.body.username));
    } catch (err) {
        console.error('Error:', err);
        return done(err);
    }
}));
//Local Strategy for Login
passport.use('local-login', new LocalStrategy({passReqToCallback:true},async function(req, username, password, done){
    try {
        const donorUser = await donor.findOne({ 'local.username':username });
        if (!donorUser){
            return done(null, false, req.flash("error", 'User does not exist.'));
        }
        if (!donorUser.validPassword(password)){
            return done(null,false, req.flash("error", 'Oops! Wrong password.'));
        }
        console.log("Logged in Successfully!");
        console.log("Hi  " + donorUser.name);
        return done(null, donorUser,req.flash("success", "Successfully Logged In! Welcome " + req.body.username));
    } catch (err) {
        console.error('Error:', err);
        return done(err);
    }
}));
passport.use('local-login-hospital', new LocalStrategy({ passReqToCallback: true }, async function (req, username, password, done) {
    try {
        const hospitalUser = await hospital.findOne({ 'local.username': username });
        if (!hospitalUser) {
            console.log("Wrong Username!");
            return done(null, false,req.flash("error", 'User does not exist.'));
        }
        if (!hospitalUser.validPassword(password)) {
            console.log("Wrong Password!");
            return done(null, false, req.flash("error", 'Oops! Wrong password.'));
        }
        console.log("Logged in Successfully!");
        console.log("Welcome  " + hospitalUser.name);
        console.log("HIII 1"+hospitalUser);
        console.log("hiii 2 "+req.user);
        return done(null, hospitalUser,req.flash("success", "Successfully Logged In! Welcome " + req.body.username));
    } catch (err) {
        console.error('Error:', err);
        return done(err);
    }
}));


//Facebook-Login

passport.use(new FacebookStrategy({
    clientID        : configAuth.facebookAuth.clientID,
    clientSecret    : configAuth.facebookAuth.clientSecret,
    callbackURL     : configAuth.facebookAuth.callbackURL

    },async function(token, refreshToken, profile, done) {
        // donor.Create({ 'facebook.id' : profile.id }, function (err, user) {
        //     return cb(err, user);
        //   });
        try {
            console.log(profile);
            console.log(token);
            const user = await donor.findOne({ 'facebook.id':profile.id });
            if (user) {
                return done(null, user);
            } else {
                var newUser            = new donor();
                newUser.facebook.id    = profile.id;
                newUser.facebook.token = token;
                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebook.email = profile.emails[0].value;

                if(profile.emails === undefined)
                    console.log("It is undefined");
                else
                {
                   console.log("Hi....");
                   console.log(typeof(undefined));
                   console.log(typeof(profile.emails));

                   newUser.facebook.email = profile.emails[0].value;
                }
                const created = await newUser.save();
                console.log("facebook ---->")
                return done(null, newUser);
            }
        } catch (err) {
            return done(err);
        }
    }


));


passport.use(new GoogleStrategy({

    clientID        : configAuth.googleAuth.clientID,
    clientSecret    : configAuth.googleAuth.clientSecret,
    callbackURL     : configAuth.googleAuth.callbackURL,

},
async function(token, refreshToken, profile, done) {
    try {
        // try to find the user based on their google id
        const user = await donor.findOne({ 'google.id':profile.id });
        if (user) {
            // if a user is found, log them in
            return done(null, user);
        } else {
            // if the user isnt in our database, create a new user
            var newUser          = new donor();

            // set all of the relevant information
            newUser.google.id    = profile.id;
            newUser.google.token = token;
            newUser.google.name  = profile.displayName;
            newUser.google.email = profile.emails[0].value; // pull the first email

            // save the user
            const created = await newUser.save();
            return done(null, newUser);
        }
    } catch (err) {
        console.error('Error:', err);
        return done(err);
    }
}));

};
