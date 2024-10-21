// database.js
const mongoose = require('mongoose');

// Transaction schema
const transactionSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  dateOfSale: String,
  isSold: Boolean,
  category: String,
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Seed data
const seedData = [
  {
    title: 'Product 1',
    description: 'Description for Product 1',
    price: 150,
    dateOfSale: '2024-10-01',
    isSold: true,
    category: 'Electronics',
  },
  // Add more seed data as needed
];

// Function to initialize database
const initializeDatabase = async () => {
  const count = await Transaction.countDocuments();
  if (count === 0) {
    await Transaction.insertMany(seedData);
    console.log('Database seeded with sample data');
  }
};

module.exports = {
  Transaction,
  initializeDatabase,
};
