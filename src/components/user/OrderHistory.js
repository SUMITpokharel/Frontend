import React, { useEffect, useState } from "react";
import orderService from "../../services/orderService";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleCancel = async (orderId) => {
    try {
      await orderService.cancelOrder(orderId);
      alert("Order cancelled successfully!");
      setOrders(
        orders.map((order) =>
          order.orderId === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (err) {
      alert(
        err.response?.data?.message || err.message || "Failed to cancel order."
      );
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!orders.length) return <div>No orders found.</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1>Order History</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Claim Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{new Date(order.orderDate).toLocaleString()}</td>
              <td>{order.status}</td>
              <td>${order.totalAmount?.toFixed(2) ?? "N/A"}</td>
              <td>{order.claimCode || "-"}</td>
              <td>
                {order.status !== "Cancelled" &&
                  order.status !== "Fulfilled" && (
                    <button onClick={() => handleCancel(order.orderId)}>
                      Cancel Order
                    </button>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderHistory;
