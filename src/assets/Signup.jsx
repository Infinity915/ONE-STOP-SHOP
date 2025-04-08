import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useAuth } from '../context/auth';

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const { setAuth } = useAuth();

  const addUser = async (e) => {
    e.preventDefault();
    const user = { name, email, phone, password, address, answer };

    try {
      const response = await axios.post("http://localhost:2100/api/auth/register", user, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(response.data);
      setMessage("✅ Registration Successful!");

      // ✅ Save token in localStorage
      localStorage.setItem("token", response.data.token);
      setAuth({
        user: response.data.user,
        token: response.data.token,
      });

    } catch (error) {
      console.error("❌ Signup Error:", error.response?.data || error);
      setMessage("❌ Registration Failed: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <Container>
        <h1 className='text-center'>REGISTRATION FORM</h1>
        <Form className='mt-4' onSubmit={addUser}>
          <Form.Group className="mb-3 w-50 mx-auto" controlId="formGroupName">
            <Form.Control
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 w-50 mx-auto" controlId="formGroupEmail">
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 w-50 mx-auto" controlId="formGroupPhone">
            <Form.Control
              type="tel"
              placeholder="Enter phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 w-50 mx-auto" controlId="formGroupPassword">
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 w-50 mx-auto" controlId="formGroupAddress">
            <Form.Control
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3 w-50 mx-auto" controlId="formGroupAnswer">
            <Form.Control
              type="text"
              placeholder="What is your favorite sport?"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </Form.Group>

          <Button type='submit' className='my-5 w-50 mx-auto d-block text-center'>
            SIGNUP
          </Button>
        </Form>
        {message && <p className="text-center">{message}</p>}
      </Container>
    </div>
  );
}

export default Signup;
