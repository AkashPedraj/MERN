// F:\mern-challenge-frontend\src\services\api.ts

import axios from 'axios';

// Update the base URL to point to your backend API
const API_BASE_URL = 'http://localhost:5000/api';

// Fetch transactions by month, with optional search and pagination
export const fetchTransactions = async (month: string, search: string = '', page: number = 1, perPage: number = 10) => {
  const response = await axios.get(`${API_BASE_URL}/transactions`, {
    params: {
      month,
      search,
      page,
      perPage,
    },
  });
  return response.data;
};

// Fetch statistics for the selected month
export const fetchStatistics = async (month: string) => {
  const response = await axios.get(`${API_BASE_URL}/statistics`, {
    params: { month },
  });
  return response.data;
};

// Fetch data for the bar chart
export const fetchBarChartData = async (month: string) => {
  const response = await axios.get(`${API_BASE_URL}/chart`, {
    params: { month },
  });
  return response.data;
};

// Fetch data for the pie chart
export const fetchPieChartData = async (month: string) => {
  const response = await axios.get(`${API_BASE_URL}/pie-chart`, {
    params: { month },
  });
  return response.data;
};

// Fetch combined data from all APIs
export const fetchCombinedData = async (month: string) => {
  const response = await axios.get(`${API_BASE_URL}/combined`, {
    params: { month },
  });
  return response.data;
};
