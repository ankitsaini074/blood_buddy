var express               = require('express'),
    app                   = express(),
    mongoose              = require('mongoose'),
    bodyParser            = require('body-parser'),
    passport              = require('passport'),
    LocalStrategy         = require("passport-local").Strategy,
    cookieParser          = require("cookie-parser"),
    session               = require('express-session'),
    flash                 = require('connect-flash'),
    donor                 = require('./models/donor.js'),
    hospital              = require('./models/hospital.js'),
    hashmap               = require('hashmap');



function countDonors(map){


   donor.find({}).select().exec((err,donors) => {
       if(err)
       return handleError(err);
       donors.forEach((element)=>{
           if(element.activeStatus==true){
       map.forEach((key,mapelement)=>{
          // console.log(element.bloodGroup);
         //  
           if(element.bloodGroup === mapelement)
           {
           // console.log(mapelement);
            key=key+1;
            map.set(mapelement,key);
           }
       })}
       
   });
  // console.log(map.get("A1+"));
});

donor.find({}).select().exec((err,donors) => {
    if(err)
    return handleError(err);
    donors.forEach((element)=>{        
            var x= map.get("donorcount");
            x=x+1;
            map.set("donorcount",x);       

});

});

hospital.find({}).select().exec((err,donors) => {
    if(err)
    return handleError(err);
    donors.forEach((element)=>{        
            var x= map.get("hospcount");
            x=x+1;
            map.set("hospcount",x);       

});

});




}

module.exports = countDonors ;



