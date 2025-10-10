require('dotenv').config();
const mongoose = require('mongoose');

const clientOptions = { family: 4, serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, clientOptions);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

module.exports = connectDB;