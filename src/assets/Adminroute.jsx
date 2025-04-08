import React, { useEffect, useState } from "react";
import { useAuth } from "../context/auth";
import axios from "axios";
import { Navigate, Outlet } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || "http://localhost:2100";

function Adminroute() {
  const [ok, setOk] = useState(false);
  const { auth } = useAuth();
  const token = auth?.token || localStorage.getItem("token");

  useEffect(() => {
    const authCheck = async () => {
      if (!token) {
        setOk(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/adminAuth`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setOk(res.data.ok);
      } catch (error) {
        console.error("Error checking admin authentication:", error);
        setOk(false);
      }
    };

    authCheck();
  }, [token]);

  // Redirect if not an admin
  if (!token || !auth.user || auth.user.role !== 1) {
    return <Navigate to="/signin" />;
  }

  return ok ? <Outlet /> : <p>Loading...</p>;
}

export default Adminroute;
