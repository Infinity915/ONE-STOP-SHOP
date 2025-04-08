import React from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col, Card } from 'react-bootstrap';
import Usermenu from '../Usermenu'; // Adjust the path based on your directory structure
import { useAuth } from '../../context/auth'; // Corrected import path

function Dashboard() {
  const { auth } = useAuth(); // Access auth context

  return (
    <div>
      <Container>
        <Row>
          <Col md={3}>
            <Usermenu /> {/* Move Usermenu inside the Col */}
          </Col>
          <Col md={9}>
            <Card className="mb-3">
              <Card.Body>
                <h4>USER NAME: {auth?.user?.name}</h4>
                <h4>EMAIL: {auth?.user?.email}</h4>
                <h4>CONTACT: {auth?.user?.phone}</h4>
                <h4>ADDRESS: {auth?.user?.address}</h4>
              </Card.Body>
            </Card>
            <Card className="mt-3">
              <Card.Body>
                <Card.Title>Orders</Card.Title>
                <Card.Text>
                  View your past orders and track current orders.
                </Card.Text>
              </Card.Body>
            </Card>
            <Card className="mt-3">
              <Card.Body>
                <Card.Title>Profile</Card.Title>
                <Card.Text>
                  Update your profile information, change your password, and more.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dashboard;
