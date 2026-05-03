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
router.post("/", async function(req,res)
{
    try {
        var hospitalList = [];

        if(req.body.bloodGroup == "0")
        {
            if(req.body.city == "0")
            {
                hospitalList = await hospital.find({});
            }
            else
            {
                hospitalList = await hospital.find({"city":req.body.city});
            }
        }
        else
        {
            if(req.body.city == "0")
            {
                hospitalList = await hospital.find({"bloodGroup":req.body.bloodGroup});
            }
            else
            {
                hospitalList = await hospital.find({"city":req.body.city}).where('bloodGroup').equals(req.body.bloodGroup);
            }
        }

        res.render("displayHospital",{ hospitals:hospitalList});
    } catch (err) {
        console.error(err);
    }
});

module.exports = router;
