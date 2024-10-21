// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeDatabase, Transaction } = require('./database');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/transactions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  initializeDatabase(); // Initialize database with seed data
});

// List all transactions with search and pagination
app.get('/api/transactions', async (req, res) => {
  const { page = 1, perPage = 10, search = '' } = req.query;

  const query = search
    ? {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { price: { $regex: search } },
        ],
      }
    : {};

  const transactions = await Transaction.find(query)
    .skip((page - 1) * perPage)
    .limit(parseInt(perPage));

  const total = await Transaction.countDocuments(query);

  res.json({ transactions, total });
});

// Statistics for the selected month
app.get('/api/statistics', async (req, res) => {
  const { month } = req.query;

  const totalSales = await Transaction.aggregate([
    {
      $match: { dateOfSale: { $regex: `${month}`, $options: 'i' } }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$price' },
        soldItems: { $sum: { $cond: [{ $eq: ['$isSold', true] }, 1, 0] } },
        notSoldItems: { $sum: { $cond: [{ $eq: ['$isSold', false] }, 1, 0] } },
      }
    }
  ]);

  res.json(totalSales[0] || { total: 0, soldItems: 0, notSoldItems: 0 });
});

// Bar chart data for the selected month
app.get('/api/chart', async (req, res) => {
  const { month } = req.query;

  const chartData = await Transaction.aggregate([
    {
      $match: { dateOfSale: { $regex: `${month}`, $options: 'i' } }
    },
    {
      $bucket: {
        groupBy: '$price',
        boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
        default: '901-above',
        output: {
          count: { $sum: 1 }
        }
      }
    },
    {
      $project: {
        _id: 0,
        priceRange: {
          $cond: {
            if: { $eq: ['$_id', '901-above'] },
            then: '901 and above',
            else: {
              $concat: [
                { $toString: '$_id' },
                ' - ',
                { $toString: { $add: ['$_id', 99] } }
              ]
            }
          }
        },
        count: '$count'
      }
    }
  ]);

  res.json(chartData);
});

// Pie chart data for unique categories in the selected month
app.get('/api/pie-chart', async (req, res) => {
  const { month } = req.query;

  const pieData = await Transaction.aggregate([
    {
      $match: { dateOfSale: { $regex: `${month}`, $options: 'i' } }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(pieData);
});

// Combined API response
app.get('/api/combined', async (req, res) => {
  const { month } = req.query;

  const [transactions, statistics, chartData, pieData] = await Promise.all([
    Transaction.find({ dateOfSale: { $regex: `${month}`, $options: 'i' } }),
    getStatistics(month),
    getChartData(month),
    getPieChartData(month),
  ]);

  res.json({ transactions, statistics, chartData, pieData });
});

// Function to get statistics
const getStatistics = async (month) => {
  const totalSales = await Transaction.aggregate([
    {
      $match: { dateOfSale: { $regex: `${month}`, $options: 'i' } }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$price' },
        soldItems: { $sum: { $cond: [{ $eq: ['$isSold', true] }, 1, 0] } },
        notSoldItems: { $sum: { $cond: [{ $eq: ['$isSold', false] }, 1, 0] } },
      }
    }
  ]);
  return totalSales[0] || { total: 0, soldItems: 0, notSoldItems: 0 };
};

// Function to get chart data
const getChartData = async (month) => {
  const chartData = await Transaction.aggregate([
    {
      $match: { dateOfSale: { $regex: `${month}`, $options: 'i' } }
    },
    {
      $bucket: {
        groupBy: '$price',
        boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000],
        default: '901-above',
        output: {
          count: { $sum: 1 }
        }
      }
    }
  ]);
  return chartData;
};

// Function to get pie chart data
const getPieChartData = async (month) => {
  const pieData = await Transaction.aggregate([
    {
      $match: { dateOfSale: { $regex: `${month}`, $options: 'i' } }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);
  return pieData;
};

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
