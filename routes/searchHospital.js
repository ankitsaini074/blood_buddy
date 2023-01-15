var express = require("express"),
    router  = express.Router(),
    hospital = require("../models/hospital"),
    request = require("request");

 
//Show Search page
router.get("/",function(req,res)
{
    res.render("searchHospital");

});

//Handle Search Logic
router.post("/",function(req,res)
{
    var hospitals = [];
    if(req.body.bloodGroup == "0")
    {
        if(req.body.city == "0")
        {
            hospital.find({}).select().exec(function (err, hospitalList) {
                if (err) 
                  return handleError(err); 
                res.render("displayHospital",{ hospitals:hospitalList});   
            })
        } 
        else 
           {
               hospital.find({"city":req.body.city}).select().exec(function (err, hospitalList) {
               if (err) 
                 return handleError(err); 
               res.render("displayHospital",{ hospitals:hospitalList});         
              });
           }
    }
    else 
    {
        if(req.body.city == "0")
        {
            hospital.find({"bloodGroup":req.body.bloodGroup}).select().exec(function (err, hospitalList) {
                if (err) 
                  return handleError(err); 
                res.render("displayHospital",{ hospitals:hospitalList});   
            })
        }
        else 
        {
            hospital.find({"city":req.body.city}).where('bloodGroup').equals(req.body.bloodGroup ).select().exec(function (err, hospitalList) {
            if (err)
                 return handleError(err);
            res.render("displayHospital",{ hospitals:hospitalList});  
                  
            });
        }       
    }
});

module.exports = router;