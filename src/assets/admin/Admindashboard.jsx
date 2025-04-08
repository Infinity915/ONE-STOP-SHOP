import React from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Card } from 'react-bootstrap';
import Adminmenu from '../Adminmenu'; // Adjust the path based on your directory structure
import { useAuth } from '../../context/auth'; // Corrected import path

function AdminDashboard() {
  const { auth } = useAuth(); // Access auth context

  if (!auth?.user) {
    return <p>Loading...</p>; // Handle loading state
  }

  return (
    <div>
      <Container>
        <Row>
          <Col md={3}>
            <Adminmenu /> {/* Move Adminmenu inside the Col */}
          </Col>
          <Col md={9}>
            <Card className="mb-3">
              <Card.Body>
                <h4>ADMIN NAME: {auth?.user?.name}</h4>
                <h4>EMAIL: {auth?.user?.email}</h4>
                <h4>CONTACT: {auth?.user?.phone}</h4>
                <h4>ADDRESS: {auth?.user?.address}</h4>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AdminDashboard;
