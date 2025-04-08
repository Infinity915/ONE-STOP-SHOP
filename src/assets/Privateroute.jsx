import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/auth';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

function Privateroute({ children }) {
  const [ok, setOk] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get("http://localhost:2100/api/auth/userAuth", {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        console.log("Auth Check Response:", res.data); // Log response
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error("Error checking authentication", error);
        setOk(false);
      }
    };

    if (auth?.token) {
      authCheck();
    } else {
      setOk(false);
    }
  }, [auth?.token]);

  console.log("Auth State in Privateroute:", auth); // Log auth state

  if (ok) {
    return children;
  } else if (!auth.user) {
    return <Navigate to="/Signin" />; // Ensure redirect to Signin if not authenticated
  } else if (auth.user.role === 1) { // Check role from auth.user.role
    return <Navigate to="/admindashboard" />; // Redirect to admin dashboard if role is 1
  }

  return null; // Return nothing if still loading
}

export default Privateroute;
