var express = require('express');
var router  = express.Router();
var Camp    = require('../models/camp');

router.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

function isHospital(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.userType === 'Hospital') return next();
    req.flash('error', 'Only hospitals can post blood camps.');
    res.redirect('/home');
}

router.get('/', async (req, res) => {
    try {
        const now = new Date();
        const camps = await Camp.find({ status: 'upcoming', date: { $gte: now } })
            .sort({ date: 1 }).lean();
        const pastCamps = await Camp.find({
            $or: [{ status: 'completed' }, { date: { $lt: now } }]
        }).sort({ date: -1 }).limit(10).lean();
        res.render('camps', { camps, pastCamps });
    } catch (err) {
        console.error(err);
        res.render('camps', { camps: [], pastCamps: [] });
    }
});

router.post('/new', isHospital, async (req, res) => {
    try {
        const { title, city, address, date, endDate, description, contactNumber } = req.body;
        await Camp.create({
            title,
            organizer:         req.user.name,
            organizerUsername: req.user.local && req.user.local.username,
            city,
            address,
            date:    new Date(date),
            endDate: endDate ? new Date(endDate) : undefined,
            description,
            contactNumber
        });
        req.flash('success', 'Blood camp posted successfully!');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to post camp. Please check all fields.');
    }
    res.redirect('/profileHospital');
});

module.exports = router;
