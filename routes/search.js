var express = require("express"),
    router  = express.Router(),
    donor = require("../models/donor"),
    hospital = require("../models/hospital"),
    request = require("request");

router.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

//Show Search page
router.get("/",function(req,res)
{
    res.render("search");
});

//Handle Search Logic
router.post("/", async function(req,res)
{
    try {
        var hospitalList = [];
        var donorList = [];

        if(req.body.bloodGroup == "0")
        {
            if(req.body.city == "0")
            {
                donorList = await donor.find({});
                hospitalList = await hospital.find({});
            }
            else
            {
                donorList = await donor.find({"city":req.body.city});
                hospitalList = await hospital.find({"city":req.body.city});
            }
        }
        else
        {
            if(req.body.city == "0")
            {
                donorList = await donor.find({"bloodGroup":req.body.bloodGroup});
                hospitalList = await hospital.find({});
            }
            else
            {
                donorList = await donor.find({"city":req.body.city}).where('bloodGroup').equals(req.body.bloodGroup);
                hospitalList = await hospital.find({"city":req.body.city});
            }
        }

        donorList.forEach(function(element){
            if(element.activeStatus == true)
                hospitalList.push(element);
        });

        res.render("displayDonor",{ donors:hospitalList});
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
