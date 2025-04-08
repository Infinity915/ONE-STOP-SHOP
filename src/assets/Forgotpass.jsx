import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Forgotpass() {
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  function changepass(e) {
    e.preventDefault();
    let newpass = { email, answer, newPassword };
    axios.post("http://localhost:2100/api/auth/forgotpass", newpass)
      .then((res) => {
        console.log(res);
        alert("Password changed successfully!"); // Show success alert
        navigate("/signin");
      })
      .catch((err) => {
        console.error("Error:", err);
        alert("Failed to change password."); // Show failure alert
      });
  }

  return (
    <div>
      <Container>
        <h1 className='text-center'>FORGOT PASSWORD</h1>
        <Form className='mt-4' onSubmit={changepass}>
          <Form.Group className="mb-3 w-50 mx-auto" controlId="formGroupEmail">
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3 w-50 mx-auto" controlId="formGroupAnswer">
            <Form.Control
              type="text"
              placeholder="Which is your fav sport?"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </Form.Group>
          
          <Form.Group className="mb-3 w-50 mx-auto" controlId="formGroupPassword">
            <Form.Control
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>

          <Button type='submit' className='my-5 w-50 mx-auto d-block text-center'>
            FORGOT PASSWORD
          </Button>
        </Form>
      </Container>
    </div>
  );
}

export default Forgotpass;
