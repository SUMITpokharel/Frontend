import React, { useEffect, useState } from 'react';
import { 
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ScatterChart,
  Scatter,
  CartesianGrid as BarGrid,
  CartesianGrid as ScatterGrid
} from 'recharts';
import bookService from '../../services/bookService';
import orderService from '../../services/orderService';
import discountService from '../../services/discountService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminCharts = () => {
  const [bookSalesData, setBookSalesData] = useState([]);
  const [publisherData, setPublisherData] = useState([]);
  const [discountData, setDiscountData] = useState([]);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchBookSalesData(),
          fetchPublisherData(),
          fetchDiscountData(),
          fetchStockData()
        ]);
      } catch (err) {
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchBookSalesData = async () => {
    try {
      const orders = await orderService.getOrders();
      const salesData = orders.reduce((acc, order) => {
        const date = new Date(order.orderDate).toLocaleDateString();
        const total = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const existing = acc.find(d => d.date === date);
        if (existing) {
          existing.sales += total;
          existing.orders++;
        } else {
          acc.push({ date, sales: total, orders: 1 });
        }
        return acc;
      }, []);
      setBookSalesData(salesData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const fetchPublisherData = async () => {
    try {
      const books = await bookService.getAllBooks();
      const publisherStats = books.reduce((acc, book) => {
        const publisher = book.publisher.name;
        const existing = acc.find(p => p.name === publisher);
        if (existing) {
          existing.count++;
          existing.sales += book.price;
        } else {
          acc.push({
            name: publisher,
            count: 1,
            sales: book.price
          });
        }
        return acc;
      }, []);
      setPublisherData(publisherStats);
    } catch (error) {
      console.error('Error fetching publisher data:', error);
    }
  };

  const fetchDiscountData = async () => {
    try {
      const discounts = await discountService.getActiveDiscounts();
      const discountStats = discounts.map(discount => ({
        name: discount.name,
        usage: discount.usageCount,
        value: discount.value
      }));
      setDiscountData(discountStats);
    } catch (error) {
      console.error('Error fetching discount data:', error);
    }
  };

  const fetchStockData = async () => {
    try {
      const books = await bookService.getAllBooks();
      const stockStats = books.map(book => ({
        title: book.title,
        stock: book.stock,
        sales: book.sales
      }));
      setStockData(stockStats);
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  };

  return (
    <div className="admin-charts-container">
      {loading && (
        <div className="loading-container" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
          <p>Loading charts...</p>
        </div>
      )}
      {error && (
        <div className="error-container" style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '10px', color: 'red' }}>
          <p>{error}</p>
        </div>
      )}
      {!loading && !error && (
        <>
          <div className="chart-section">
            <h3>Sales Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookSalesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" name="Total Sales" stroke="#0088FE" />
                <Line type="monotone" dataKey="orders" name="Total Orders" stroke="#FFBB28" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-section">
            <h3>Publisher Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={publisherData}
                  dataKey="sales"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  fill="#8884d8"
                  label
                >
                  {publisherData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-section">
            <h3>Discount Usage</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={discountData}>
                <BarGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="usage" name="Usage Count" fill="#8884d8" />
                <Bar dataKey="value" name="Discount Value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-section">
            <h3>Stock Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <ScatterGrid />
                <XAxis type="number" dataKey="stock" name="Stock" />
                <YAxis type="number" dataKey="sales" name="Sales" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter
                  name="Books"
                  data={stockData}
                  fill="#8884d8"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminCharts;
