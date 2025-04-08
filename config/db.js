const mongoose = require("mongoose");
const colors = require("colors");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`SUCCESSFULLY CONNECTED TO THE DATABASE: ${conn.connection.host}`.bgGreen);
    } catch (error) {
        console.log("ERROR IN CONNECTING TO THE DATABASE".bgRed, error);
    }
};

module.exports = connectDB;
