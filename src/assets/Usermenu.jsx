import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { NavLink } from 'react-router-dom';

function Usermenu() {
  return (
    <div>
      <h1>USER PANEL</h1>  
      <ListGroup className="mt-3">
        <NavLink className="list-group-item" to="/dashboard/user/orders">Orders</NavLink>
        <NavLink className="list-group-item" to="/dashboard/user/profile">Profile</NavLink>
      </ListGroup>
    </div>
  );
}

export default Usermenu;
