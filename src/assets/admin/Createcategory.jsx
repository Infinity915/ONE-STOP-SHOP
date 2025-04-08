import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/esm/Container';
import { Row, Col, ListGroup, Button } from 'react-bootstrap';
import Adminmenu from '../Adminmenu';
import Categoryform from '../Categoryform';
import axios from 'axios';
import { useAuth } from '../../context/auth';

// Load API base URL from environment, with a fallback
const apiBaseurl = import.meta.env.VITE_API_BASE_URL || "http://localhost:2100";

function Createcategory() {
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingCategory, setEditingCategory] = useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    console.log("API Base URL:", apiBaseurl);
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiBaseurl}/api/category/categories`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };
  
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`${apiBaseurl}/api/category/update-category/${editingCategory._id}`, { name }, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        alert('Category updated successfully');
        setEditingCategory(null);
      } else {
        await axios.post(`${apiBaseurl}/api/category/create-category`, { name }, {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
        alert('Category created successfully');
      }
      setName('');
      fetchCategories();
    } catch (error) {
      console.error('Error creating/updating category:', error);
    }
  };

  const handleEdit = (category) => {
    setName(category.name);
    setEditingCategory(category);
  };

  const handleDelete = async (categoryId) => {
    try {
      await axios.delete(`${apiBaseurl}/api/category/delete-category/${categoryId}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      alert('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <div style={styles.container}>
      <Container style={styles.innerContainer}>
        <Row>
          <Col md={3}>
            <Adminmenu />
          </Col>
          <Col md={9}>
            <h2 style={styles.heading}>Manage Categories</h2>
            <Categoryform handleSubmit={handleSubmit} value={name} setValue={setName} />
            
            <ListGroup className="mt-4" style={styles.listGroup}>
              {categories.length ? (
                categories.map((category) => (
                  <ListGroup.Item key={category._id} style={styles.listItem}>
                    <span style={styles.categoryText}>{category.name}</span>
                    <div>
                      <Button variant="warning" onClick={() => handleEdit(category)} style={styles.editButton}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(category._id)} style={styles.deleteButton}>
                        Delete
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item style={styles.emptyMessage}>No categories found</ListGroup.Item>
              )}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// ✅ Inline Styles for a Classy Look
const styles = {
  container: {
    background: "#f5f5f5",
    minHeight: "100vh",
    padding: "40px 0",
    fontFamily: "'Poppins', sans-serif"
  },
  innerContainer: {
    background: "#ffffff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    maxWidth: "900px",
    margin: "auto"
  },
  heading: {
    textAlign: "center",
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#333"
  },
  listGroup: {
    marginTop: "20px",
    borderRadius: "8px",
    overflow: "hidden"
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#fff",
    padding: "15px",
    marginBottom: "5px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
  },
  categoryText: {
    fontSize: "16px",
    fontWeight: "500",
    color: "#333"
  },
  editButton: {
    marginRight: "10px",
    backgroundColor: "#f0ad4e",
    borderColor: "#f0ad4e",
    padding: "5px 10px",
    fontSize: "14px",
    fontWeight: "bold"
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    borderColor: "#d9534f",
    padding: "5px 10px",
    fontSize: "14px",
    fontWeight: "bold"
  },
  emptyMessage: {
    textAlign: "center",
    padding: "20px",
    fontSize: "16px",
    color: "#888"
  }
};

export default Createcategory;
