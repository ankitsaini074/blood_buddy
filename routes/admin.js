const express = require('express');
const router = express.Router();
const donor = require('../models/donor');
const hospital = require('../models/hospital');

function isAdminLoggedIn(req, res, next) {
    if (req.session && req.session.isAdmin) return next();
    res.redirect('/admin/login');
}

router.get('/login', (req, res) => {
    if (req.session && req.session.isAdmin) return res.redirect('/admin');
    res.render('adminLogin', { error: req.flash('error') });
});

router.post('/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    if (password === adminPassword) {
        req.session.isAdmin = true;
        return res.redirect('/admin');
    }
    req.flash('error', 'Incorrect admin password.');
    res.redirect('/admin/login');
});

router.post('/logout', (req, res) => {
    req.session.isAdmin = false;
    res.redirect('/admin/login');
});

router.get('/', isAdminLoggedIn, async (req, res) => {
    try {
        const donors = await donor.find({}).lean();
        const hospitals = await hospital.find({}).lean();

        const bloodGroupCounts = {};
        donors.forEach(d => {
            if (d.bloodGroup) {
                bloodGroupCounts[d.bloodGroup] = (bloodGroupCounts[d.bloodGroup] || 0) + 1;
            }
        });

        const cityCounts = {};
        donors.forEach(d => {
            if (d.city) cityCounts[d.city] = (cityCounts[d.city] || 0) + 1;
        });
        const topCities = Object.entries(cityCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const activeDonors = donors.filter(d => d.activeStatus).length;

        res.render('admin', {
            donors,
            hospitals,
            bloodGroupCounts,
            topCities,
            activeDonors,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/donors/:id/delete', isAdminLoggedIn, async (req, res) => {
    try {
        await donor.findByIdAndDelete(req.params.id);
        req.flash('success', 'Donor deleted successfully.');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to delete donor.');
    }
    res.redirect('/admin');
});

router.post('/hospitals/:id/delete', isAdminLoggedIn, async (req, res) => {
    try {
        await hospital.findByIdAndDelete(req.params.id);
        req.flash('success', 'Hospital deleted successfully.');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to delete hospital.');
    }
    res.redirect('/admin');
});

module.exports = router;
