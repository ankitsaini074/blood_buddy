var mongoose = require('mongoose');

var hospitalRequestSchema = new mongoose.Schema({
    hospitalName:      { type: String, required: true },
    hospitalUsername:  { type: String, default: '' },
    city:              { type: String, required: true },
    bloodGroup:        { type: String, required: true },
    unitsNeeded:       { type: Number, required: true, min: 1 },
    urgency:           { type: String, enum: ['normal', 'urgent', 'critical'], default: 'normal' },
    deadline:          { type: Date },
    notes:             { type: String, default: '' },
    contactNumber:     { type: String, default: '' },
    status:            { type: String, enum: ['open', 'fulfilled', 'closed'], default: 'open' },
    createdAt:         { type: Date, default: Date.now }
});

module.exports = mongoose.model('HospitalRequest', hospitalRequestSchema);
