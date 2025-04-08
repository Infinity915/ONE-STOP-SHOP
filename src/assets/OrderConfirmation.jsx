
import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const { amount, transactionId, user } = state || {};
  const userName = user?.name || "Valued Customer";

  const [width, height] = useWindowSize();

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, #e9f5ff, #ffffff)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
    }}>
      {/* 🎊 Confetti Burst */}
      <Confetti width={width} height={height} numberOfPieces={300} recycle={false} />

      <div style={{
        maxWidth: "520px",
        width: "100%",
        backgroundColor: "#ffffff",
        padding: "40px",
        borderRadius: "16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}>
        <FaCheckCircle color="#28a745" size={70} style={{ marginBottom: "20px" }} />
        <h2 style={{ marginBottom: "15px", fontSize: "28px", color: "#333" }}>Thank You, {userName}! 🎉</h2>
        <p style={{ fontSize: "18px", color: "#555" }}>Your payment was successful.</p>

        <div style={{
          marginTop: "30px",
          padding: "20px",
          backgroundColor: "#f1f8ff",
          borderRadius: "10px",
          textAlign: "left",
        }}>
          <p><strong>🧾 Transaction ID:</strong> <br />{transactionId}</p>
          <p style={{ marginTop: "10px" }}><strong>💰 Amount Paid:</strong> ₹{amount}</p>
        </div>

        <p style={{ marginTop: "30px", color: "#888", fontStyle: "italic" }}>
          A confirmation email has been sent to your inbox.
        </p>

        <Link
          to="/dashboard/user/orders"
          style={{
            marginTop: "30px",
            display: "inline-block",
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "500",
          }}
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
