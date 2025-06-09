const mongoose = require('mongoose');

const mongo_url = process.env.MONGODB_URI;

const connectDB = async () => {
    mongoose.connect(mongo_url)
    .then(() => {
        console.log('MongoDB Connected...');
    }).catch((err) => {
        console.log('MongoDB Connection Error: ', err);
    })
}

module.exports = connectDB;
