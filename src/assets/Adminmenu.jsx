import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { NavLink } from 'react-router-dom';

function Adminmenu() {
  return (
    <div>
      <h1>ADMIN PANEL</h1>
      <ListGroup className='mt-3'>
        <NavLink className="list-group-item" to="/dashboard/admin/create-category">Create Category</NavLink>
        <NavLink className="list-group-item" to="/dashboard/admin/create-product">Create Product</NavLink>
        <NavLink className="list-group-item" to="/dashboard/admin/user">Users</NavLink>
      </ListGroup>
    </div>
  );
}

export default Adminmenu;
