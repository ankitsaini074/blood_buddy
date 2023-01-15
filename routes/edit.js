var express = require("express"),
    router  = express.Router(),
    donor = require("../models/donor"),
    request = require("request"),
    multer         = require('multer'),
    path           = require('path');

    router.use(function(req, res, next){
        res.locals.currentUser = req.user;
            next();
    });

// Show edit form
router.get('/',function(req,res){
    res.render('edit',{donor : req.user});
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


//Handling edit logic
router.post('/',(req,res,next)=>{
    upload(req,res,(err)=>{
        if(err)
        res.render('edit',{msg: err , donor : req.user});
        else 
        {
          if(req.file == undefined){
              res.render('edit',{msg:'Error: No file selected!' , donor : req.user});
          }
          else {
            next();
          }
        }
        
    })
   },
   function(req,res){
    var updatedDonor = new donor(); 
    updatedDonor.local.username    = req.user.local.username;
    updatedDonor.local.password = updatedDonor.generateHash(req.body.password);
    updatedDonor.name = req.user.name;
    updatedDonor.email = req.body.email;
    updatedDonor.profilePic = req.file.filename;
    updatedDonor.confirmPassword = req.body.confirmPassword;
    updatedDonor.dob = req.body.dob;
    updatedDonor.gender = req.body.gender;
    updatedDonor.bloodGroup = req.body.bloodGroup;
    updatedDonor.dateOfLastDonation = req.body.dateOfLastDonation;
    updatedDonor.city = req.body.city;
    updatedDonor.contactNumber = req.body.contactNumber;
    updatedDonor.address = req.body.address;
    updatedDonor.userType = req.body.userType;
    updatedDonor.activeStatus = req.body.activeStatus;
    updatedDonor._id = req.user._id;
    console.log(req.user,req.user.local.username,updatedDonor,req.user._id);
    
    donor.findByIdAndUpdate(req.user._id,{$set: updatedDonor}, {upsert:true}, function(err, updated){
        if (err) console.log(err);
        //check - console.log(updated);
        req.flash('success','Updated Successfully!');
        res.redirect('/profile');
    });

});

module.exports = router;