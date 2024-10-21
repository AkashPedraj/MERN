const express = require('express');
const { getTransactions, getStatistics, getBarChartData } = require('../controllers/transactionController');

const router = express.Router();

router.get('/transactions', getTransactions);
router.get('/statistics', getStatistics);
router.get('/bar-chart', getBarChartData); // Ensure this matches your frontend API call

module.exports = router;
