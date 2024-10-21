const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
    const { search, page = 1, perPage = 10, month } = req.query;

    const filter = month ? { dateOfSale: { $regex: month, $options: 'i' } } : {};

    if (search) {
        filter.$or = [
            { title: { $regex: search, $options: 'i' } },
            { description: { $regex: search, $options: 'i' } },
            { price: parseFloat(search) || 0 }
        ];
    }

    try {
        const transactions = await Transaction.find(filter)
            .skip((page - 1) * perPage)
            .limit(parseInt(perPage));
        const total = await Transaction.countDocuments(filter);

        res.json({ transactions, total });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: 'Error fetching transactions' });
    }
};

const getStatistics = async (req, res) => {
    const { month } = req.query;

    const filter = month ? { dateOfSale: { $regex: month, $options: 'i' } } : {};

    try {
        const totalSale = await Transaction.aggregate([
            { $match: filter },
            { $group: { _id: null, totalAmount: { $sum: '$price' } } }
        ]);

        const soldItems = await Transaction.countDocuments({ ...filter, isSold: true });
        const notSoldItems = await Transaction.countDocuments({ ...filter, isSold: false });

        res.json({
            totalAmount: totalSale[0]?.totalAmount || 0,
            totalSoldItems: soldItems,
            totalNotSoldItems: notSoldItems
        });
    } catch (error) {
        console.error("Error fetching statistics:", error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
};

const getBarChartData = async (req, res) => {
    const { month } = req.query;
    const filter = month ? { dateOfSale: { $regex: month, $options: 'i' } } : {};

    const priceRanges = [
        { min: 0, max: 100 }, { min: 101, max: 200 },
        { min: 201, max: 300 }, { min: 301, max: 400 },
        { min: 401, max: 500 }, { min: 501, max: 600 },
        { min: 601, max: 700 }, { min: 701, max: 800 },
        { min: 801, max: 900 }, { min: 901, max: Infinity }
    ];

    try {
        const data = await Promise.all(priceRanges.map(async (range) => {
            const count = await Transaction.countDocuments({
                ...filter,
                price: { $gte: range.min, $lte: range.max }
            });
            return { range: `${range.min}-${range.max}`, count };
        }));

        res.json(data);
    } catch (error) {
        console.error("Error fetching bar chart data:", error);
        res.status(500).json({ message: 'Error fetching bar chart data' });
    }
};

module.exports = { getTransactions, getStatistics, getBarChartData };
