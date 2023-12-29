const express = require('express');
const connectDataBase = require("./connection/databaseConnection")
const bodyParser = require('body-parser');
const User = require('./models/userModel');
const Poll = require('./models/pollModel');
const Question = require('./models/questionModel');
const Option = require('./models/optionModel');
const Response = require('./models/responseModel');
const Analytics = require('./models/anlyticsModel');
const apiRoutes = require('./api/api');

const cors = require('cors');
//require("dotenv").config();
const app = express();
app.use(bodyParser.json());
const Port = process.env.PORT || 5000;
app.use(cors());

app.use('/api', apiRoutes);

app.listen(Port, async () => {
    try {
        await connectDataBase.connectDataBase();
        console.log('Database connected successfully!');
    } catch (error) {
        console.log('Error:', error);
    }
});