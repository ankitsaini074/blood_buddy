const express = require('express');
const router = express.Router();
const donor = require('../models/donor');
const hospital = require('../models/hospital');
const hospDatabase = require('../models/hospDatabase');
const Request = require('../models/request');
const Camp = require('../models/camp');
const HospitalRequest = require('../models/hospitalRequest');

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
        const [donors, hospitals, requests, camps, hospNeeds] = await Promise.all([
            donor.find({}).lean(),
            hospital.find({}).lean(),
            Request.find({}).sort({ createdAt: -1 }).lean(),
            Camp.find({}).sort({ date: -1 }).lean(),
            HospitalRequest.find({}).sort({ createdAt: -1 }).lean()
        ]);

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
            requests,
            camps,
            hospNeeds,
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

router.get('/inventory', isAdminLoggedIn, async (req, res) => {
    try {
        const inventoryRecords = await hospDatabase.find({}).lean();
        const hospitals = await hospital.find({}).lean();

        const BLOOD_FIELDS = [
            { key: 'A1',  label: 'A1+'  },
            { key: 'A1_', label: 'A1-'  },
            { key: 'A2',  label: 'A2+'  },
            { key: 'A2_', label: 'A2-'  },
            { key: 'A',   label: 'A+'   },
            { key: 'A_',  label: 'A-'   },
            { key: 'B',   label: 'B+'   },
            { key: 'B_',  label: 'B-'   },
            { key: 'A1B', label: 'A1B+' },
            { key: 'A1B_',label: 'A1B-' },
            { key: 'A2B', label: 'A2B+' },
            { key: 'A2B_',label: 'A2B-' },
            { key: 'AB',  label: 'AB+'  },
            { key: 'AB_', label: 'AB-'  },
            { key: 'O',   label: 'O+'   },
            { key: 'O_',  label: 'O-'   },
        ];

        const hospitalMap = {};
        hospitals.forEach(h => { hospitalMap[h.local && h.local.username] = h; });

        const totalByGroup = {};
        BLOOD_FIELDS.forEach(f => { totalByGroup[f.label] = 0; });
        inventoryRecords.forEach(rec => {
            BLOOD_FIELDS.forEach(f => {
                const val = parseInt(rec[f.key], 10);
                if (!isNaN(val)) totalByGroup[f.label] += val;
            });
        });

        res.render('adminInventory', {
            inventoryRecords,
            hospitalMap,
            BLOOD_FIELDS,
            totalByGroup,
            success: req.flash('success'),
            error: req.flash('error')
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/requests/:id/status', isAdminLoggedIn, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['open', 'fulfilled', 'closed'].includes(status)) {
            req.flash('error', 'Invalid status.');
            return res.redirect('/admin');
        }
        await Request.findByIdAndUpdate(req.params.id, { status });
        req.flash('success', `Request marked as ${status}.`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update request.');
    }
    res.redirect('/admin');
});

router.post('/requests/:id/delete', isAdminLoggedIn, async (req, res) => {
    try {
        await Request.findByIdAndDelete(req.params.id);
        req.flash('success', 'Request deleted.');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to delete request.');
    }
    res.redirect('/admin');
});

router.post('/camps/:id/status', isAdminLoggedIn, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['upcoming', 'completed', 'cancelled'].includes(status)) {
            req.flash('error', 'Invalid camp status.');
            return res.redirect('/admin');
        }
        await Camp.findByIdAndUpdate(req.params.id, { status });
        req.flash('success', `Camp marked as ${status}.`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update camp.');
    }
    res.redirect('/admin');
});

router.post('/camps/:id/delete', isAdminLoggedIn, async (req, res) => {
    try {
        await Camp.findByIdAndDelete(req.params.id);
        req.flash('success', 'Camp deleted.');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to delete camp.');
    }
    res.redirect('/admin');
});

router.post('/hospneeds/:id/status', isAdminLoggedIn, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['open', 'fulfilled', 'closed'].includes(status)) {
            req.flash('error', 'Invalid status.');
            return res.redirect('/admin');
        }
        await HospitalRequest.findByIdAndUpdate(req.params.id, { status });
        req.flash('success', `Hospital need marked as ${status}.`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update hospital need.');
    }
    res.redirect('/admin');
});

router.post('/hospneeds/:id/delete', isAdminLoggedIn, async (req, res) => {
    try {
        await HospitalRequest.findByIdAndDelete(req.params.id);
        req.flash('success', 'Hospital need deleted.');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to delete hospital need.');
    }
    res.redirect('/admin');
});

router.post('/inventory/:name/update', isAdminLoggedIn, async (req, res) => {
    try {
        const record = await hospDatabase.findOne({ name: req.params.name });
        if (!record) {
            req.flash('error', 'Inventory record not found.');
            return res.redirect('/admin/inventory');
        }
        const fields = ['A1','A1_','A2','A2_','A','A_','B','B_','A1B','A1B_','A2B','A2B_','AB','AB_','O','O_'];
        fields.forEach(f => {
            if (req.body[f] !== undefined) record[f] = req.body[f];
        });
        await record.save();
        req.flash('success', `Inventory for ${req.params.name} updated.`);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Failed to update inventory.');
    }
    res.redirect('/admin/inventory');
});

module.exports = router;
