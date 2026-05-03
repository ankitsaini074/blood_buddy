const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
    requesterName:  { type: String, required: true },
    bloodGroup:     { type: String, required: true },
    city:           { type: String, required: true },
    hospital:       { type: String, default: '' },
    contactNumber:  { type: String, required: true },
    message:        { type: String, default: '' },
    urgency:        { type: String, enum: ['normal', 'urgent', 'critical'], default: 'normal' },
    status:         { type: String, enum: ['open', 'fulfilled', 'closed'], default: 'open' },
    createdAt:      { type: Date, default: Date.now }
});

module.exports = mongoose.model('request', requestSchema);
