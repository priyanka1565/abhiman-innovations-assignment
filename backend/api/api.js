const express = require('express');
const router = express.Router();


const User = require('../models/userModel');
const Poll = require('../models/pollModel');
const Question = require('../models/questionModel');
const Option = require('../models/optionModel');
const Response = require('../models/responseModel');
const Analytics = require('../models/anlyticsModel');


router.post('/polls', async (req, res) => {
    try {
        const { title, description, creatorId, questions } = req.body;

   
        const poll = await Poll.create({ title, description, creator: creatorId });

      
        for (const questionData of questions) {
            const { questionText, questionType, options } = questionData;
            const question = await Question.create({ poll: poll._id, questionText:questionText, questionType:questionType });
            

           
            for (const optionText of options) {
                await Option.create({ question: question._id, optionText });
            }
        }

        res.status(201).json({ message: 'Poll created successfully', poll });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/polls', async (req, res) => {
    try {
        const polls = await Poll.find().populate('creator').exec();
        const analytics = await Analytics.find().exec();

        res.status(200).json({ polls, analytics });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.put('/polls/:pollId', async (req, res) => {
    try {
        const { pollId } = req.params;
        const { title, description, questions } = req.body;

       
        const updatedPoll = await Poll.findByIdAndUpdate(
            pollId,
            { title, description },
            { new: true }
        ).exec();

       
        for (const questionData of questions) {
            const { questionId, questionText, questionType, options } = questionData;

           
            const updatedQuestion = await Question.findByIdAndUpdate(
                questionId,
                { questionText, questionType },
                { new: true, upsert: true } 
            ).exec();

           
            for (const optionData of options) {
                const { optionId, optionText } = optionData;
                await Option.findByIdAndUpdate(
                    optionId,
                    { question: updatedQuestion._id, optionText },
                    { new: true, upsert: true }
                ).exec();
            }
        }

        res.status(200).json({ message: 'Poll updated successfully', poll: updatedPoll });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



router.get('/user/:userId/polls', async (req, res) => {
    try {
        const { userId } = req.params;

    
        const userPolls = await Poll.find({ creator: userId }).exec();

        const questionsPerPoll = await Promise.all(
            userPolls.map(async (poll) => {
                const pollQuestions = await Question.find({ poll: poll._id }).exec();
                return { poll, questions: pollQuestions };
            })
        );

        res.status(200).json({ userPolls: questionsPerPoll });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/submit/:userId/:pollId', async (req, res) => {
    try {
        const { userId, pollId } = req.params;
        const { responses } = req.body;

        const user = await User.findByIdAndUpdate(userId, { $inc: { points: 1 } }).exec();

        
        await Promise.all(
            responses.map(async (response) => {
                const { questionId, selectedOptionId } = response;

             
                await Response.create({ user: userId, poll: pollId, question: questionId, selectedOption: selectedOptionId });

               
                await Analytics.findOneAndUpdate(
                    { poll: pollId, question: questionId, option: selectedOptionId },
                    { $inc: { count: 1 } },
                    { upsert: true }
                ).exec();
            })
        );

        res.status(200).json({ message: 'Poll submitted successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/polls/:pollId/analytics', async (req, res) => {
    try {
        const { pollId } = req.params;

        
        const pollAnalytics = await Analytics.find({ poll: pollId }).exec();

        res.status(200).json({ pollId, analytics: pollAnalytics });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.get('/analytics', async (req, res) => {
    try {
       
        const overallAnalytics = await Analytics.find().exec();

        res.status(200).json({ analytics: overallAnalytics });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

