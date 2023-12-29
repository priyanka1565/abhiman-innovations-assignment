const mongoose = require("mongoose");

function connectDataBase() {
    return mongoose.connect("mongodb+srv://priyankaingle250:priya1565@cluster0.zrm5cra.mongodb.net/ticket_booking")

}
module.exports = { connectDataBase }