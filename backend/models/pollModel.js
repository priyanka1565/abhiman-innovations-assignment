const mongoose = require('mongoose');

const pollSchema = new mongoose.Schema({
    title: String,
    description: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
   
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
