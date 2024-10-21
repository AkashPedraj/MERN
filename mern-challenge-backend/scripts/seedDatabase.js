require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Transaction = require('../models/Transaction');

const seedDatabase = async () => {
    await connectDB();

    try {
        const response = await axios.get(process.env.THIRD_PARTY_API_URL);
        const transactions = response.data;

        // Clear existing data
        await Transaction.deleteMany();

        // Seed the database
        await Transaction.insertMany(transactions);
        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding the database', error);
        process.exit(1);
    }
};

seedDatabase();
