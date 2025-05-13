import React, { useEffect, useState } from "react";
import cartService from "../../services/cartService";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cartService
      .getCart()
      .then((data) => {
        setCart(data);
        setLoading(false);
      })
      .catch((err) => {
        // If 404, treat as empty cart
        if (err.response && err.response.status === 404) {
          setCart({ cartItems: [] });
        }
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!cart || !cart.cartItems || cart.cartItems.length === 0)
    return (
      <div className="empty-cart">
        <span>🛒</span>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate("/user/dashboard")}>
          Start Shopping
        </button>
      </div>
    );

  const cartTotal = cart.cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <CartContainer>
      <h1>Shopping Cart</h1>
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
                        setCart({
                          ...cart,
                          cartItems: cart.cartItems.filter(
                            (ci) => ci.cartItemId !== item.cartItemId
                          ),
                        });
                      } catch (err) {
                        if (err.response && err.response.status === 404) {
                          alert(
                            "Cart item not found. It may have already been removed."
                          );
                          // Optionally, remove it from UI anyway:
                          setCart({
                            ...cart,
                            cartItems: cart.cartItems.filter(
                              (ci) => ci.cartItemId !== item.cartItemId
                            ),
                          });
                        } else {
                          alert("Failed to remove cart item.");
                        }
                      }
                    }}
                  >
                    🗑️
                  </button>
                </div>
                <div>Quantity: {item.quantity}</div>
                <div>Price: ${item.price}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={async () => {
          try {
            await cartService.placeOrder(cart.cartItems);
            alert("Order placed successfully!");
            setCart({ cartItems: [] }); // Optionally clear cart in UI
          } catch (err) {
            alert(
              err.response?.data?.message ||
                err.message ||
                "Failed to place order."
            );
          }
        }}
      >
        Place Order
      </button>
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
    background: #f8fafc;
  }

  .cart-item-img img {
    width: 90px;
    height: 135px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.07);
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

  .cart-item-info p {
    color: #64748b;
    font-size: 0.98rem;
    margin: 0;
  }

  .cart-item-actions {
    display: flex;
    align-items: center;
    gap: 18px;
    margin-top: 8px;
  }

  .quantity-control {
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 2px 10px;
    background: #f1f5f9;
  }

  .quantity-btn {
    background-color: #e0e7ef;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 1.1rem;
    color: #2563eb;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .quantity-btn:disabled {
    cursor: not-allowed;
    color: #a0aec0;
    background: #f1f5f9;
  }
  .quantity-btn:not(:disabled):hover {
    background: #2563eb;
    color: #fff;
  }

  .cart-item-price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }

  .cart-item-price span {
    font-weight: 600;
    font-size: 1.08rem;
    color: #1e293b;
  }

  .cart-item-price .original-price {
    text-decoration: line-through;
    color: #94a3b8;
    font-size: 0.98rem;
    margin-left: 6px;
  }

  .clear-cart-btn {
    margin-top: 18px;
    text-align: right;
  }
  .clear-cart-btn button {
    border: 1.5px solid #2563eb;
    color: #2563eb;
    background: none;
    padding: 8px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }
  .clear-cart-btn button:hover {
    background: #2563eb;
    color: #fff;
  }

  .order-summary {
    background-color: #f8fafc;
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

  .total-row {
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    color: #1e293b;
    font-size: 1.12rem;
    margin-top: 18px;
    border-top: 1.5px solid #e5e7eb;
    padding-top: 10px;
  }

  .checkout-btns {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .checkout-btns button {
    width: 100%;
    padding: 12px 0;
    border: none;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1.08rem;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
  }

  .checkout-btn {
    background-color: #2563eb;
    color: white;
    margin-bottom: 4px;
  }
  .checkout-btn:hover {
    background: #1d4ed8;
  }

  .continue-shopping-btn {
    background-color: #fff;
    border: 1.5px solid #2563eb;
    color: #2563eb;
    margin-top: 0;
  }
  .continue-shopping-btn:hover {
    background: #2563eb;
    color: #fff;
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

  .empty-cart p {
    color: #64748b;
    margin-bottom: 32px;
    font-size: 1.05rem;
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
    .cart-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      padding: 14px 0;
    }
    .cart-item-img img {
      width: 80px;
      height: 110px;
    }
    .order-summary {
      padding: 18px 8px;
    }
    .empty-cart {
      padding: 40px 0 30px 0;
    }
    .empty-cart span {
      font-size: 40px;
    }
  }
`;