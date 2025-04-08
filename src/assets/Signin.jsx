import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth';

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { setAuth, auth } = useAuth();

  const login = async (e) => {
    e.preventDefault();
    const user = { email, password };

    try {
      const response = await axios.post("http://localhost:2100/api/auth/login", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Login Success! Response Data:", response.data);

      //storing token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("🔑 Token Saved to LocalStorage:", localStorage.getItem("token")); // Debugging
      } else {
        console.error("❌ No token received!");
      }

      setAuth({
        user: response.data.user,
        token: response.data.token,
        role: response.data.user.role
      });

      setRedirect(true);
    } catch (error) {
      console.error("❌ Login Error:", error.response?.data || error);
    }
  };

  if (redirect) {
    return <Navigate to={auth?.user?.role === 1 ? "/admindashboard" : "/dashboard"} />;
  }

  return (
    <div>
      <Container>
        <h1 className='text-center'>SIGNIN FORM</h1>
        <Form className='mt-4' onSubmit={login}>
          <Form.Group className="mb-3 w-50 mx-auto" controlId="formGroupEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 w-50 mx-auto" controlId="formGroupPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button type='submit' className='my-5 w-50 mx-auto d-block'>
            SIGNIN
          </Button>
          <Link to="/forgotpassword" className="d-block text-center mt-3">
            Forgot Password?
          </Link>
        </Form>
      </Container>
    </div>
  );
}

export default Signin;
