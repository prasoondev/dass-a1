const mongoose = require("mongoose");
require('dotenv').config()
async function dbConnect() {
    const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URL)
    .then(() => console.log('Successfully connected to MongoDB Atlas!'))
    .catch((err) => console.error('Error connecting to MongoDB Atlas:', err));

}

module.exports = dbConnect;