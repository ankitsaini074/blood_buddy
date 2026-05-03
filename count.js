const express = require('express'),
    mongoose = require('mongoose');

const donor = require('./models/donor.js'),
    hospital = require('./models/hospital.js'),
    hashmap = require('hashmap');

async function countDonors(map){
    try {
        const donors = await donor.find({activeStatus:true});
        donors.forEach((element)=>{
            if(element.activeStatus==true){
                const bloodGroupKey = element.bloodGroup;
                const currentCount = map.get(bloodGroupKey) || 0;
                map.set(bloodGroupKey, currentCount + 1);
            }
        });

        const hospitals = await hospital.find({});
        hospitals.forEach((element)=>{
            if(element.activeStatus==true){
                const currentCount = map.get('hospcount') || 0;
                map.set('hospcount', currentCount + 1);
            }
        });

        return {
            donorCount: donors.length,
            hospCount: hospitals.length
        };
    } catch (err) {
        console.error('Error counting:', err.message);
        return {
            donorCount: 0,
            hospCount: 0
        };
    }
}

module.exports = countDonors;
