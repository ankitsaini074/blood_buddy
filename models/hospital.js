var mongoose              = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");
    bcrypt                = require('bcrypt-nodejs');  

var hospSchema = new mongoose.Schema({
        local: 
        {
        username : String,
        password : String,
        },
        name : String,
        email : String,
        profilePic : String,
      //  confirmPassword : String,
        city : String,
        contactNumber : String,
        address : String,
        userType : String                                                                      //changed
});

//Hashing Password
hospSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Checking if password is valid
hospSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
hospSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("hospital", hospSchema);
