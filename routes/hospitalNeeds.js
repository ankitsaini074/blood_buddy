var express         = require('express');
var router          = express.Router();
var HospitalRequest = require('../models/hospitalRequest');

router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

function isHospital(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.userType === 'Hospital') return next();
    req.flash('error', 'Only hospitals can post bulk blood needs.');
    res.redirect('/home');
}

router.get('/', async (req, res) => {
    try {
        const needs = await HospitalRequest.find({ status: 'open' })
            .sort({ urgency: 1, createdAt: -1 }).lean();
        res.render('hospitalNeeds', { needs });
    } catch (err) {
        console.error(err);
        res.render('hospitalNeeds', { needs: [] });
    }
});

router.post('/new', isHospital, async (req, res) => {
    try {
        const { bloodGroup, unitsNeeded, urgency, deadline, notes, contactNumber } = req.body;
        await HospitalRequest.create({
            hospitalName:     req.user.name,
            hospitalUsername: req.user.local && req.user.local.username,
            city:             req.user.city,
            bloodGroup,
            unitsNeeded:      parseInt(unitsNeeded, 10),
            urgency,
            deadline:         deadline ? new Date(deadline) : undefined,
            notes,
            contactNumber:    contactNumber || req.user.contactNumber
        });
        req.flash('success', 'Bulk blood need posted!');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to post bulk need.');
    }
    res.redirect('/profileHospital');
});

module.exports = router;
