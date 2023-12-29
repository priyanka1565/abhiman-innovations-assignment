const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    optionText: String,
   
});

const Option = mongoose.model('Option', optionSchema);

module.exports = Option;
