var express = require("express"),
    router  = express.Router(),
    donor = require("../models/donor"),
    hospital = require("../models/hospital"),
    request = require("request");

 
//Show Search page
router.get("/",function(req,res)
{
    res.render("search");
});

//Handle Search Logic
router.post("/",function(req,res)
{
//    console.log(req.body.city);
//    console.log(req.body.bloodGroup);
    if(req.body.bloodGroup == "0")
    {
        if(req.body.city == "0")
        {

            var srch= new Promise((resolve,reject)=>
            {
                donor.find({}).select().exec(function (err, donorList)
                    {
                        if (err) 
                          reject(err);
                        else resolve(donorList);                         
                    })
            })
            .then((donorList)=>
            {
                hospital.find({},function (err, hospList)
                {
                                if (err) 
                                  return handleError(err); 
                                donorList.forEach(function(element)
                                {
                                    if(element.activeStatus == true)
                                    hospList.push(element);
                                });
                                res.render("displayDonor",{ donors:hospList});
                })
            },(err)=>
                {
                       return handleError(err);
                })
        }

       
        else 
        {
              
            var srch= new Promise((resolve,reject)=>
            {
                donor.find({"city":req.body.city}).select().exec(function (err, donorList)
                    {
                        if (err) 
                          reject(err);
                        else resolve(donorList);                         
                    })
            })
            .then((donorList)=>
            {
                hospital.find({"city":req.body.city},function (err, hospList)
                {
                                if (err) 
                                  return handleError(err); 
                                donorList.forEach(function(element)
                                {
                                    if(element.activeStatus == true)
                                     hospList.push(element);
                                });
                                res.render("displayDonor",{ donors:hospList});
                })
            },(err)=>
                {
                       return handleError(err);
                })

        }
    }
    else 
    {
        if(req.body.city == "0")
        {
            var srch= new Promise((resolve,reject)=>
            {
                donor.find({"bloodGroup":req.body.bloodGroup}).select().exec(function (err, donorList)
                    {
                        if (err) 
                          reject(err);
                        else resolve(donorList);                         
                    })
            })
            .then((donorList)=>
            {
                hospital.find({},function (err, hospList)
                {
                                if (err) 
                                  return handleError(err); 
                                donorList.forEach(function(element)
                                {
                                    if(element.activeStatus == true)
                                    hospList.push(element);
                                });
                                res.render("displayDonor",{ donors:hospList});
                })
            } ,(err)=>
                {
                       return handleError(err);
                })
            
        }
        else 
        {
            var srch= new Promise((resolve,reject)=>
            {
                donor.find({"city":req.body.city}).where('bloodGroup').equals(req.body.bloodGroup ).select().exec(function (err, donorList)
                    {
                        if (err) 
                          reject(err);
                        else resolve(donorList);                         
                    })
            })
            .then((donorList)=>
            {
                hospital.find({"city":req.body.city},function (err, hospList)
                {
                                if (err) 
                                  return handleError(err); 
                                donorList.forEach(function(element)
                                {
                                    if(element.activeStatus == true)
                                    hospList.push(element);
                                });
                                res.render("displayDonor",{ donors:hospList});
                })
            },(err)=>
                {
                       return handleError(err);
                })
            
        }       
    }
});

module.exports = router;