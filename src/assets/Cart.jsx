import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom"; //  Import navigate

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const navigate = useNavigate(); //  Setup navigation

  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:2100"; 
  const [imageSources, setImageSources] = useState({});

  useEffect(() => {
    const newImageSources = {};
    cart.forEach((item) => {
      if (item.image?.startsWith("http")) {
        newImageSources[item._id] = item.image;
      } else {
        newImageSources[item._id] = `${API_BASE_URL.replace(/\/$/, '')}/uploads/${item.image.replace(/^\/uploads\//, '')}`;
      }
    });
    setImageSources(newImageSources);
  }, [cart]);

  const handleImageError = (id) => {
    setImageSources((prev) => ({
      ...prev,
      [id]: "/fallback-image.jpg", 
    }));
  };

  return (
    <div style={{
      maxWidth: "800px",
      margin: "auto",
      padding: "20px",
      background: "#fff",
      borderRadius: "8px",
      boxShadow: "0px 3px 6px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Shopping Cart</h2>

      {cart.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cart.map((item) => (
              <li key={item._id} style={{
                display: "flex",
                alignItems: "center",
                padding: "15px",
                borderBottom: "1px solid #ddd"
              }}>
                {/* Product Image */}
                <img
                  src={imageSources[item._id]}
                  alt={item.name}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "5px",
                    marginRight: "15px",
                    background: "#f0f0f0",
                  }}
                  onError={() => handleImageError(item._id)}
                />

                {/* Product Details */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: "0 0 5px" }}>{item.name}</h4>
                  <p style={{ margin: 0, color: "#555" }}>Price: ₹{item.price}</p>
                  <div style={{ display: "flex", alignItems: "center", marginTop: "5px" }}>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={{
                        padding: "5px 10px",
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: item.quantity > 1 ? "pointer" : "not-allowed",
                        marginRight: "10px"
                      }}>
                      -
                    </button>
                    <span style={{
                      fontSize: "16px",
                      fontWeight: "bold",
                      margin: "0 10px"
                    }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      style={{
                        padding: "5px 10px",
                        background: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                      }}>
                      +
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item._id)}
                  style={{
                    background: "red",
                    color: "#fff",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    marginLeft: "10px"
                  }}>
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Cart Total */}
          <div style={{
            textAlign: "right",
            marginTop: "20px",
            fontSize: "18px",
            fontWeight: "bold"
          }}>
            Total: ₹{totalPrice.toFixed(2)}
          </div>

          {/*  Checkout Button with Navigation */}
          <button
            onClick={() => navigate("/checkout")}
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "20px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px"
            }}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
