import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import cartService from "../../services/cartService";
import styled from "styled-components";

const Cart = () => {
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCarts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await cartService.getCart(); // Fetches array of carts
        setCarts(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.message === "User is not authenticated. Please log in.") {
          navigate("/login");
        } else if (err.response && err.response.status === 404) {
          setCarts([]); // Treat 404 as no carts
        } else {
          setError("Failed to load carts. Please try again.");
        }
      }
    };
    fetchCarts();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!carts || carts.length === 0)
    return (
      <div className="empty-cart">
        <span>🛒</span>
        <h2>You have no carts</h2>
        <button onClick={() => navigate("/user/dashboard")}>
          Start Shopping
        </button>
      </div>
    );

  return (
    <CartContainer>
      <h1>Your Carts</h1>
      {carts.map((cart, index) => {
        const cartTotal = cart.cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return (
          <CartSection key={cart.cartId + index}>
            <h2>Cart ID: {cart.cartId}</h2>
            <div className="cart-content">
              <div className="cart-items">
                {cart.cartItems.map((item) => (
                  <div key={item.cartItemId} className="cart-item">
                    <div className="cart-item-info">
                      <div className="cart-item-header">
                        <h3>{item.bookName}</h3>
                        <button
                          className="remove-btn"
                          onClick={async () => {
                            try {
                              await cartService.removeCartItem(item.cartItemId);
                              setCarts((prevCarts) =>
                                prevCarts.map((c, i) =>
                                  i === index
                                    ? {
                                        ...c,
                                        cartItems: c.cartItems.filter(
                                          (ci) => ci.cartItemId !== item.cartItemId
                                        ),
                                      }
                                    : c
                                )
                              );
                            } catch (err) {
                              if (
                                err.message ===
                                "User is not authenticated. Please log in."
                              ) {
                                navigate("/login");
                              } else {
                                setError("Failed to remove item. Please try again.");
                              }
                            }
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                      <div>Quantity: {item.quantity}</div>
                      <div>Price: ${item.price}</div>
                      <div>Total: ${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-summary">
                <h2>Order Summary</h2>
                <div className="summary-row">
                  <span>Total Items: {cart.cartItems.length}</span>
                  <span>{cart.cartItems.length} item(s)</span>
                </div>
                <div className="summary-row">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <button
                  className="checkout-btn"
                  onClick={() => navigate(`/checkout/${cart.cartId}`)}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </CartSection>
        );
      })}
    </CartContainer>
  );
};

export default Cart;

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
  background-color: #fff;
  border-radius: 18px;
  box-shadow: 0 6px 24px rgba(59, 130, 246, 0.08);
  min-height: 70vh;

  h1 {
    font-size: 2.2rem;
    font-weight: 700;
    margin-bottom: 40px;
    color: #2563eb;
    letter-spacing: 1px;
    text-align: left;
  }
`;

const CartSection = styled.div`
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background-color: #f8fafc;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 20px;
  }

  .cart-content {
    display: flex;
    gap: 40px;
    flex-wrap: wrap;
    align-items: flex-start;
  }

  .cart-items {
    flex: 2;
    min-width: 320px;
  }

  .cart-item {
    display: flex;
    gap: 20px;
    padding: 20px 0;
    border-bottom: 1px solid #e5e7eb;
    align-items: center;
    transition: background 0.2s;
    border-radius: 10px;
  }

  .cart-item:hover {
    background: #f1f5f9;
  }

  .cart-item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .cart-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .cart-item-header h3 {
    font-weight: 600;
    font-size: 1.1rem;
    color: #1e293b;
    margin: 0;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #ef4444;
    font-size: 1.2rem;
    cursor: pointer;
    transition: color 0.2s;
    padding: 0 4px;
  }
  .remove-btn:hover {
    color: #b91c1c;
  }

  .order-summary {
    background-color: #fff;
    border-radius: 14px;
    padding: 32px 24px;
    flex: 1;
    min-width: 260px;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.04);
  }

  .order-summary h2 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 18px;
    color: #2563eb;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    color: #475569;
    font-size: 1.05rem;
  }

  .checkout-btn {
    background-color: #2563eb;
    color: white;
    padding: 12px 0;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1.08rem;
    cursor: pointer;
    transition: background 0.2s;
    width: 100%;
    margin-top: 20px;
  }
  .checkout-btn:hover {
    background: #1d4ed8;
  }

  .empty-cart {
    text-align: center;
    padding: 80px 0 60px 0;
    color: #64748b;
  }

  .empty-cart span {
    font-size: 60px;
    color: #cbd5e1;
    display: block;
    margin-bottom: 18px;
  }

  .empty-cart h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 18px 0 8px 0;
    color: #2563eb;
  }

  .empty-cart button {
    background-color: #2563eb;
    color: white;
    padding: 12px 36px;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1.08rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  .empty-cart button:hover {
    background: #1d4ed8;
  }

  @media (max-width: 900px) {
    .cart-content {
      flex-direction: column;
      gap: 32px;
    }
    .order-summary {
      margin-top: 32px;
    }
  }

  @media (max-width: 600px) {
    padding: 18px 2px;
    h1 {
      font-size: 1.3rem;
      margin-bottom: 24px;
    }
    h2 {
      font-size: 1.2rem;
    }
  }
`;