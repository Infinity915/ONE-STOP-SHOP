import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth'; // Import useAuth hook

function Signout() {
  const { setAuth } = useAuth(); // Use useAuth hook to get setAuth function
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user authentication data
    localStorage.removeItem("auth");
    setAuth({
      user: null,
      token: ""
    });

    // Redirect to sign-in page
    navigate('/Signin');
  }, [setAuth, navigate]);

  return (
    <div>
      <h2>Signing out...</h2>
    </div>
  );
}

export default Signout;
