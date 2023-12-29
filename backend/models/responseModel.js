const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll' },
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedOption: { type: mongoose.Schema.Types.ObjectId, ref: 'Option' },
  
});

const Response = mongoose.model('Response', responseSchema);

module.exports = Response;
