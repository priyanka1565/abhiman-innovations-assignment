const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    poll: { type: mongoose.Schema.Types.ObjectId, ref: 'Poll' },
    questionText: String,
    questionType: String,
    // Other relevant question fields
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
