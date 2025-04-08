import React from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import { useAuth } from '../context/auth';
import { useCart } from '../context/CartContext';
import NavDropdown from 'react-bootstrap/NavDropdown';

function Header() {
  const { auth, setAuth } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  // Calculate total cart items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  function handleLogout() {
    localStorage.removeItem("auth");
    setAuth({ user: null, token: "", role: null });
    navigate('/Signin');
  }

  const handleDashboardClick = () => {
    if (auth.user.role === 1) {
      navigate('/admindashboard');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={NavLink} to="/">ONE SHOP STOP</Navbar.Brand>
        <Nav className="ml-auto align-items-center">
          <NavLink to="/" className="nav-link">HOME</NavLink>

          {!auth.user ? (
            <>
              <NavLink to="/Signin" className="nav-link">SIGNIN</NavLink>
              <NavLink to="/Signup" className="nav-link">SIGNUP</NavLink>
            </>
          ) : (
            <NavDropdown 
              title={auth.user.name} 
              id="nav-dropdown"
              menuVariant="light"  // Ensures background stays light
              style={{ color: "black" }}  // Dropdown title text color
            >
              <NavDropdown.Item 
                onClick={handleDashboardClick} 
                style={{ color: "black" }} // Ensures visible text
              >
                Dashboard
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item 
                onClick={handleLogout} 
                style={{ color: "black" }} // Ensures visible text
              >
                SIGNOUT
              </NavDropdown.Item>
            </NavDropdown>
          )}

          {/* Cart Icon with Small Badge */}
          <NavLink to="/Cart" className="nav-link" style={{ position: "relative" }}>
            <FaShoppingCart size={20} />
            {totalItems > 0 && (
              <span style={{
                position: "absolute",
                top: "-4px",
                right: "-6px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                width: "16px",
                height: "16px",
                fontSize: "10px",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                {totalItems}
              </span>
            )}
          </NavLink>

        </Nav>
      </Container>
    </Navbar>
  );
}

export default Header;
