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
    if(mimetype && extname)
    {
        return cb(null,true);
    }
    else
    {cb('Error : Images Only!');}
}


//Handling edit logic
router.post('/',(req,res,next)=>{
    upload(req,res,(err)=>{
        if(err) {
            // Allow form submission even if upload fails, but keep old profile pic
            req.file = { filename: req.user.profilePic };
        }
        if(!req.file) {
            req.file = { filename: req.user.profilePic };
        }
        next();
    })
   },
   async function(req,res){
    try {
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
        // Smart logic: handle both checkbox scenarios
        // If user was INACTIVE (!true) and checked, they want to become ACTIVE
        // If user was ACTIVE (true) and checked, they want to become INACTIVE
        const wasActive = req.user.activeStatus === true;
        const isChecked = !!req.body.activeStatus;
        updatedDonor.activeStatus = !wasActive && isChecked;
        updatedDonor._id = req.user._id;

        await donor.findByIdAndUpdate(req.user._id,{$set: updatedDonor}, {upsert:true});
        req.flash('success','Updated Successfully!');
        res.redirect('/profile');
    } catch (err) {
        console.log(err);
    }
});

router.post('/logDonation', async (req, res) => {
    if (!req.isAuthenticated()) return res.redirect('/home');
    try {
        const { date, location, notes } = req.body;
        await donor.findByIdAndUpdate(req.user._id, {
            $push: { donationLog: { $each: [{ date: new Date(date), location, notes }], $position: 0 } },
            $set:  { dateOfLastDonation: new Date(date) }
        });
        req.flash('success', 'Donation logged successfully!');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to log donation.');
    }
    res.redirect('/profile');
});

module.exports = router;
