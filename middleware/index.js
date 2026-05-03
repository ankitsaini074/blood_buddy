hospDatabase        = require('../models/hospDatabase'),
module.exports =
{

    isLoggedIn : function(req, res, next){
        if (req.isAuthenticated())
            return next();
        console.log("Log In First");
        req.flash("error", "You must be signed in to do that!");
        res.redirect('/home');
    },

     editHospData: async function(req,res,next){
        try {
            let data = await hospDatabase.findOne({"name": req.user.local.username});
            console.log(req.user.local.username);

            // Create new record if doesn't exist
            if (!data) {
                data = new hospDatabase();
                data.name = req.user.local.username;
            }

            data.A2 = req.body.A2;
            data.A2_ = req.body.A2_;
            data.B = req.body.B;
            data.B_ = req.body.B_;
            data.A1 = req.body.A1;
            data.A1B = req.body.A1B;
            data.A1_ = req.body.A1_;
            data.A1B_ = req.body.A1B_;
            data.A2B = req.body.A2B;
            data.A2B_ = req.body.A2B_;
            data.AB = req.body.AB;
            data.AB_ = req.body.AB_;
            data.O = req.body.O;
            data.O_ = req.body.O_;
            data.A = req.body.A;
            data.A_ = req.body.A_;
            await data.save();
            req.flash('success','Updated Successfully!');
            // res.redirect('/profileHospital');
            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
     },


     seed :async function(req,res,next){
        // hospDatabase.collection.dropIndex({"username":1});
        try {
            var data = new hospDatabase();
            console.log(req.body.username);
            data.name = req.body.username;
            data.A2 = "0";
            data.A2_ = "0";
            data.B = "0";
            data.B_ = "0";
            data.A1 = "0";
            data.A1B = "0";
            data.A1_ = "0";
            data.A1B_ = "0";
            data.A2B = "0";
            data.A2B_ = "0";
            data.AB = "0";
            data.AB_ = "0";
            data.O = "0";
            data.O_ = "0";
            data.A = "0";
            data.A_ = "0";
            await data.save();
            next();
        } catch (err) {
            console.log(err);
            next(err);
        }
     }

};
