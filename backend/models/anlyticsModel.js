const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll' },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    option: { type: mongoose.Schema.Types.ObjectId, ref: 'Option' },
    count: Number,
   
});

const Analytics = mongoose.model('Analytics', analyticsSchema);

module.exports = Analytics;
