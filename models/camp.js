var mongoose = require('mongoose');

var campSchema = new mongoose.Schema({
    title:              { type: String, required: true },
    organizer:          { type: String, required: true },
    organizerUsername:  { type: String, default: '' },
    city:               { type: String, required: true },
    address:            { type: String, required: true },
    date:               { type: Date,   required: true },
    endDate:            { type: Date },
    description:        { type: String, default: '' },
    contactNumber:      { type: String, required: true },
    status:             { type: String, enum: ['upcoming', 'completed', 'cancelled'], default: 'upcoming' },
    createdAt:          { type: Date, default: Date.now }
});

module.exports = mongoose.model('Camp', campSchema);
