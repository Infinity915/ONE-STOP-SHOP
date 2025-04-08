import React from 'react';
import { Form, Button } from 'react-bootstrap';

function Categoryform({ handleSubmit, value, setValue }) {
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formGroupText">
          <Form.Control
            type="text"
            placeholder="Enter Category Name"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </Form.Group>
        <Button type="submit">Add/Update Category</Button>
      </Form>
    </div>
  );
}

export default Categoryform;
