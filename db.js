const mongoose = require("mongoose");
require ('dotenv').config();
const mongoDB = async () => {  
    try {
        await mongoose.connect(process.env.MONGO_URI);

        mongoose.connection.on('connected', () => {
            console.log('Connection Established to database');
        });
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting reconnect...');
        });

    } catch (error) {
        console.error('Failed to connect to MongoDB:', error.message);
        process.exit(1);
    }
    
};

module.exports = mongoDB;
