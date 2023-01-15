var express = require("express"),
    router  = express.Router(),
    hospital = require("../models/hospital"),
    request = require("request"),
    multer         = require('multer'),
    path           = require('path');

    router.use(function(req, res, next){
        res.locals.currentUser = req.user;
            next();
    });

// Show edit form
router.get('/',function(req,res){
    res.render('editHospital',{hospital : req.user});
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
        res.render('editHospital',{msg: err , hospital : req.user});
        else 
        {
          if(req.file == undefined){
              res.render('editHospital',{msg:'Error: No file selected!' , hospital : req.user});
          }
          else {
            next();
          }
        }
        
    })
   },function(req,res){
    var updatedHospital = new hospital(); 
    updatedHospital.local.username    = req.user.local.username;
    updatedHospital.local.password = updatedHospital.generateHash(req.body.password);
    updatedHospital.name = req.user.name;
    updatedHospital.email = req.body.email;
    updatedHospital.profilePic = req.file.filename;
    updatedHospital.confirmPassword = req.body.confirmPassword;
    updatedHospital.city = req.body.city;
    updatedHospital.contactNumber = req.body.contactNumber;
    updatedHospital.address = req.body.address;
    updatedHospital.userType = req.body.userType;
    updatedHospital._id = req.user._id;
    console.log(req.user,req.user.local.username,updatedHospital,req.user._id);
    
    hospital.findByIdAndUpdate(req.user._id,{$set: updatedHospital}, {upsert:true}, function(err, updated){
        if (err) console.log(err);
        //check - console.log(updated);
        req.flash('success','Updated Successfully!');
        res.redirect('/profileHospital');
    });

});

module.exports = router;