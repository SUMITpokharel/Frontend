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
  Cell
} from 'recharts';
import orderService from '../../services/orderService';
import discountService from '../../services/discountService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminCharts = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [discountData, setDiscountData] = useState([]);
  const [orderStatusData, setOrderStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          fetchBookingsData(),
          fetchDiscountDistribution(),
          fetchOrderStatus()
        ]);
      } catch (err) {
        setError('Failed to load chart data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchBookingsData = async () => {
    try {
      const orders = await orderService.getOrders();
      const bookingsData = orders.reduce((acc, order) => {
        const date = new Date(order.orderDate).toLocaleDateString();
        const total = order.items.reduce((sum, item) => sum + (item.quantity), 0);
        const existing = acc.find(d => d.date === date);
        if (existing) {
          existing.bookings += total;
        } else {
          acc.push({ date, bookings: total });
        }
        return acc;
      }, []);
      setBookingsData(bookingsData);
    } catch (error) {
      console.error('Error fetching bookings data:', error);
    }
  };

  const fetchDiscountDistribution = async () => {
    try {
      const discounts = await discountService.getActiveDiscounts();
      const discountData = discounts.reduce((acc, discount) => {
        const existing = acc.find(d => d.name === discount.type);
        if (existing) {
          existing.value += discount.amount;
          existing.count++;
        } else {
          acc.push({
            name: discount.type,
            value: discount.amount,
            count: 1
          });
        }
        return acc;
      }, []);
      setDiscountData(discountData);
    } catch (error) {
      console.error('Error fetching discount data:', error);
    }
  };

  const fetchOrderStatus = async () => {
    try {
      const orders = await orderService.getOrders();
      const statusData = orders.reduce((acc, order) => {
        const existing = acc.find(d => d.name === order.status);
        if (existing) {
          existing.value++;
        } else {
          acc.push({
            name: order.status,
            value: 1
          });
        }
        return acc;
      }, []);
      setOrderStatusData(statusData);
    } catch (error) {
      console.error('Error fetching order status data:', error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="charts-container">
      <div className="chart-section">
        <h3>Total Bookings (Last 30 Days)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={bookingsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bookings" stroke="#0088FE" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Discount Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={discountData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#00C49F"
              label
            >
              {discountData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-section">
        <h3>Order Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={orderStatusData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              fill="#FFBB28"
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
