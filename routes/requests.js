const express = require('express');
const router = express.Router();
const Request = require('../models/request');

router.get('/', async (req, res) => {
    try {
        const requests = await Request.find({ status: 'open' })
            .sort({ urgency: -1, createdAt: -1 })
            .lean();
        const urgencyOrder = { critical: 0, urgent: 1, normal: 2 };
        requests.sort((a, b) => urgencyOrder[a.urgency] - urgencyOrder[b.urgency]);
        res.render('requests', { requests, success: req.flash('success'), error: req.flash('error') });
    } catch (err) {
        console.error(err);
        res.redirect('/home');
    }
});

router.post('/new', async (req, res) => {
    try {
        const { requesterName, bloodGroup, city, hospital, contactNumber, message, urgency } = req.body;
        if (!requesterName || !bloodGroup || !city || !contactNumber) {
            req.flash('error', 'Please fill in all required fields.');
            return res.redirect('back');
        }
        await new Request({ requesterName, bloodGroup, city, hospital, contactNumber, message, urgency }).save();
        req.flash('success', 'Your blood request has been posted. Donors in your area will be notified.');
        res.redirect('/requests');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to post request. Please try again.');
        res.redirect('back');
    }
});

module.exports = router;
