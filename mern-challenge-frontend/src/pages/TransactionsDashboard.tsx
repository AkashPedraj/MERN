// F:\mern-challenge-frontend\src\pages\TransactionsDashboard.tsx

import React, { useEffect, useState } from 'react';
import '../styles/TransactionsDashboard.css';
import { fetchTransactions, fetchStatistics, fetchBarChartData } from '../services/api';
import CustomBarChart from './BarChart';

const TransactionsDashboard: React.FC = () => {
  const [month, setMonth] = useState('March');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({ totalSales: 0, soldItems: 0, notSoldItems: 0 });
  const [chartData, setChartData] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  useEffect(() => {
    loadAllData();
  }, [month, page, search]);

  const loadAllData = () => {
    loadTransactions(month, search, page);
    loadStatistics(month);
    loadBarChartData(month);
  };

  const loadTransactions = async (selectedMonth: string, searchTerm: string, currentPage: number) => {
    try {
      const data = await fetchTransactions(selectedMonth, searchTerm, currentPage, perPage);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    }
  };

  const loadStatistics = async (selectedMonth: string) => {
    try {
      const data = await fetchStatistics(selectedMonth);
      setStatistics(data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const loadBarChartData = async (selectedMonth: string) => {
    try {
      const data = await fetchBarChartData(selectedMonth);
      setChartData(data);
    } catch (error) {
      console.error('Error loading bar chart data:', error);
    }
  };

  return (
    <div className="transactions-dashboard">
      <h1>Transactions Dashboard</h1>
      <div className="filter-section">
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            .map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        <input
          type="text"
          placeholder="Search transactions"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="statistics">
        <div>Total Sales: ${statistics.totalSales}</div>
        <div>Sold Items: {statistics.soldItems}</div>
        <div>Not Sold Items: {statistics.notSoldItems}</div>
      </div>
      <div className="transactions-table">
        {transactions.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction._id}</td>
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>${transaction.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found for {month}.</p>
        )}
        <div className="pagination">
          <button onClick={() => setPage(page > 1 ? page - 1 : 1)} disabled={page <= 1}>Previous</button>
          <span>Page {page}</span>
          <button onClick={() => setPage(page + 1)}>Next</button>
        </div>
      </div>
      <div className="bar-chart">
        <h2>Bar Chart of Transactions</h2>
        {chartData.length > 0 ? (
          <CustomBarChart data={chartData} />
        ) : (
          <p>No bar chart data available for {month}.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionsDashboard;
