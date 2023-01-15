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

     editHospData:function(req,res,next){

        hospDatabase.findOne({"name": req.user.local.username}, function (err, data) {
            if (err) console.log(err);
            console.log(req.user.local.username);
            data.A2 =req.body.A2,
        data.A2_=req.body.A2_,
        data.B =req.body.B,
        data.B_ =req.body.B_,
        data.A1 =req.body.A1,
        data.A1B=req.body.A1B,
        data.A1_=req.body.A1_,
        data.A1B_=req.body.A1B_,
        data.A2B=req.body.A2B,
        data.A2B_=req.body.A2B_,
        data.AB =req.body.AB,
        data.AB_=req.body.AB_,
        data.O =req.body.O,
        data.O_ =req.body.O_,
        data.A=req.body.A,
        data.A_ =req.body.A_;
            data.save(function(err, updated){
                    if (err) console.log(err);
                    req.flash('success','Updated Successfully!');
                    // res.redirect('/profileHospital');
                    next();
                });
          })
        
        
        },
         seed :function(req,res,next){
            // hospDatabase.collection.dropIndex({"username":1}); 
         var data=new hospDatabase();
         console.log(req.body.username);
             data.name=req.body.username,
             data.A2 ="1",
             data.A2_="1",
             data.B ="1",
             data.B_ ="1",
             data.A1 ="1",
             data.A1B="1",
             data.A1_="1",
             data.A1B_="1",
             data.A2B="1",
             data.A2B_="1",
             data.AB ="1",
             data.AB_="1",
             data.O ="1",
             data.O_ ="1",
             data.A="1",
             data.A_ ="1";
             data.save();
             next();
         }
         
};