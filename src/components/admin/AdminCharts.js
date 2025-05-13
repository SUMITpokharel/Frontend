import React, { useEffect, useState } from 'react';
import { 
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminCharts = () => {
  const [bookStockData, setBookStockData] = useState([]);
  const [discountData, setDiscountData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [books, discounts, orders] = await Promise.all([
          fetchBooks(),
          fetchActiveDiscounts(),
          fetchOrders()
        ]);
        
        setBookStockData(books);
        setDiscountData(discounts);
        setOrderStatusData(orders);
      } catch (err) {
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch('https://localhost:7256/api/Book');
      const data = await response.json();
      return data.data.map(book => ({
        name: book.bookName,
        stock: book.stock,
        price: book.price
      }));
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  };

  const fetchActiveDiscounts = async () => {
    try {
      const response = await fetch('https://localhost:7256/api/admin/discounts/active');
      const data = await response.json();
      return data.data.map(discount => ({
        name: discount.bookName,
        percentage: discount.percentage
      }));
    } catch (error) {
      console.error('Error fetching active discounts:', error);
      return [];
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://localhost:7256/api/Order');
      const data = await response.json();
      const statusData = data.data.reduce((acc, order) => {
        const status = order.status || 'Pending';
        const existing = acc.find(d => d.name === status);
        if (existing) {
          existing.value++;
        } else {
          acc.push({
            name: status,
            value: 1
          });
        }
        return acc;
      }, []);
      return statusData;
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="charts-container">
      <div className="chart-section">
        <h3>Book Stock Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bookStockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="stock" fill="#0088FE" name="Stock" />
            <Bar dataKey="price" fill="#00C49F" name="Price" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Active Discounts</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={discountData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="percentage" fill="#FFBB28" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Order Status</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={orderStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#0088FE"
              label
            >
              {orderStatusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminCharts;
