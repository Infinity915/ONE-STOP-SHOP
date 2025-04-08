// src/assets/Checkout.jsx
import React, { useEffect, useState } from "react";
import DropIn from "braintree-web-drop-in-react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [clientToken, setClientToken] = useState(null);
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2100";

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/braintree/token`);
        const data = await res.json();
        if (data.success) {
          setClientToken(data.clientToken);
        } else {
          alert("Failed to load payment options.");
        }
      } catch (err) {
        alert("Payment server connection error.");
      }
    };

    getToken();
  }, []);

  const handlePayment = async () => {
    if (!instance) {
      alert("Payment not ready yet.");
      return;
    }

    setLoading(true);
    try {
      const { nonce } = await instance.requestPaymentMethod();

      const res = await fetch(`${API_BASE_URL}/api/braintree/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentMethodNonce: nonce,
          amount: totalAmount.toFixed(2),
        }),
      });

      const result = await res.json();

      if (result.success) {
        clearCart(); //  Clears cart after payment
        navigate("/order-confirmation", {
          state: {
            amount: totalAmount.toFixed(2),
            transactionId: result.transaction.id,
          },
        });
      } else {
        alert("❌ Payment failed: " + result.error);
      }
    } catch (error) {
      alert("Payment error.");
    }

    setLoading(false);
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto", padding: "20px", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h2 style={{ textAlign: "center" }}>Checkout</h2>
      <h4>Total: ₹{totalAmount.toFixed(2)}</h4>

      {clientToken ? (
        <>
          <DropIn
            options={{ authorization: clientToken }}
            onInstance={(instance) => setInstance(instance)}
          />
          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontSize: "16px",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "10px",
            }}
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </>
      ) : (
        <p>Loading payment interface...</p>
      )}
    </div>
  );
};

export default Checkout;
