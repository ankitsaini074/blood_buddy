var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose"),
    bcrypt                = require('bcrypt-nodejs');

var donorSchema = mongoose.Schema({
        local: 
        {
            username : String,
            password : String,
        },
        facebook: 
        {
            id           : String,
            token        : String,
            name         : String,
            email        : String
        },
        google: 
        {
            id           : String,
            token        : String,
            name         : String,
            email        : String
        },
        name : String,
        email : String,
        //confirmPassword : String,
        dob : Date,
        profilePic : String,
        gender : String,
        bloodGroup : String,
        dateOfLastDonation : Date,
        city : String,
        contactNumber : String,
        address : String,
        activeStatus : Boolean ,
        userType : String
});

//Hashing Password
donorSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Checking if password is valid
donorSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

donorSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('donor', donorSchema);