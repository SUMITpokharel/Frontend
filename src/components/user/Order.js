import React, { useState } from "react";
import orderService from "../../services/orderService";
import cartService from "../../services/cartService";
import styled from "styled-components";

const Order = ({ cart, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const placeOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Log cart data for debugging
      console.log('Cart Data:', cart);
      
      // Validate cart data
      if (!cart || !cart.cartItems || cart.cartItems.length === 0) {
        throw new Error('Cart is empty or invalid');
      }

      // Prepare order items
      const orderItems = cart.cartItems.map(item => {
        if (!item.cartItemId || !item.bookId) {
          throw new Error('Invalid cart item data');
        }
        return {
          cartItemId: item.cartItemId,
          cartId: cart.cartId || '',
          bookId: item.bookId,
          bookName: item.bookName || '',
          quantity: item.quantity || 1,
          price: item.price || 0,
          totalPrice: (item.price || 0) * (item.quantity || 1)
        };
      });

      // Log order items for debugging
      console.log('Order Items:', orderItems);

      // Place the order
      const orderId = await orderService.placeOrder(orderItems);
      
      // Clear the cart after successful order
      await cartService.clearCart();
      
      // Show success message with order ID
      setSuccess({
        message: "Order placed successfully!",
        orderId: orderId || 'ORDER-' + Date.now()
      });
    } catch (err) {
      console.error('Order error details:', {
        error: err,
        response: err.response,
        data: err.response?.data,
        status: err.response?.status
      });
      
      let errorMessage = 'Failed to place order. Please try again.';
      if (err.response?.data?.error?.errorMessage) {
        errorMessage = err.response.data.error.errorMessage;
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <OrderContainer>
        <div className="order-success">
          <h2>Order Placed Successfully!</h2>
          <p>Your order has been placed successfully. Order ID: {success.orderId}</p>
          <p>Your cart has been cleared.</p>
          <button onClick={onClose}>Continue Shopping</button>
        </div>
      </OrderContainer>
    );
  }

  return (
    <OrderContainer>
      <h2>Place Order</h2>
      <div className="order-content">
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div className="items-list">
            {cart.cartItems.map((item, index) => (
              <div key={item.cartItemId} className="order-item">
                <span>{item.bookName}</span>
                <span>Qty: {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="total">
            <span>Total Amount:</span>
            <span>${cart.cartItems.reduce(
              (sum, item) => sum + (item.price * item.quantity),
              0
            ).toFixed(2)}</span>
          </div>
        </div>

        <div className="order-buttons">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>
          <button onClick={placeOrder} disabled={loading} className="place-order-btn">
            {loading ? "Placing Order..." : "Place Order"}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}
      </div>
    </OrderContainer>
  );
};

export default Order;

const OrderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  .order-content {
    background: white;
    padding: 2rem;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  h2 {
    text-align: center;
    margin-bottom: 1.5rem;
    color: #2563eb;
  }

  .order-summary {
    margin-bottom: 2rem;
  }

  .items-list {
    margin: 1rem 0;
  }

  .order-item {
    display: flex;
    justify-content: space-between;
    padding: 0.8rem;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.95rem;
  }

  .total {
    display: flex;
    justify-content: space-between;
    margin-top: 1rem;
    font-weight: 600;
    font-size: 1.1rem;
  }

  .order-buttons {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
  }

  .cancel-btn {
    background: #fff;
    border: 1px solid #e5e7eb;
    color: #2563eb;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .cancel-btn:hover {
    background: #f1f5f9;
  }

  .place-order-btn {
    background: #2563eb;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .place-order-btn:hover {
    background: #1d4ed8;
  }

  .place-order-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .error-message {
    color: #ef4444;
    margin-top: 1rem;
    text-align: center;
    font-size: 0.95rem;
  }

  .order-success {
    text-align: center;
    padding: 2rem;
  }

  .order-success h2 {
    color: #16a34a;
    margin-bottom: 1rem;
  }

  .order-success button {
    background: #16a34a;
    color: white;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.2s;
  }

  .order-success button:hover {
    background: #15803d;
  }
`;
