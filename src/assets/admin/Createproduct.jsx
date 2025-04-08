import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Image } from "react-bootstrap";
import axios from "axios";
import Adminmenu from "../Adminmenu";


const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:2100";

function CreateProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [expanded, setExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");


  
  


  // Fetch Categories
  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchProducts();
    }, 300); // 300ms delay to avoid excessive API calls
  
    return () => clearTimeout(delaySearch); // Cleanup function
  }, [selectedCategory, searchQuery]);
  

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/api/category/categories`);
      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {//chnages madeee
    try {
      const response = await axios.get(`${apiBaseUrl}/api/products`, {
        params: {
          category: selectedCategory || undefined,
          search: searchQuery || undefined, // Include search query
        },
      });
  
      setProducts(response.data.products || []);
      setTotalQuantity(response.data.totalQuantity || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Show preview
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    if (!name.trim() || !description.trim() || !category) {
      alert("Please fill in all fields and select a category.");
      return;
    }

    if (isNaN(price) || price <= 0) {
      alert("Price must be a positive number");
      return;
    }

    if (!Number.isInteger(Number(quantity)) || quantity < 0) {
      alert("Quantity must be a non-negative integer");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", parseFloat(price));
    formData.append("quantity", parseInt(quantity, 10));
    formData.append("category", category);
    if (image) formData.append("image", image);

    try {
      let response;
      if (editingProduct) {
        response = await axios.put(
          `${apiBaseUrl}/api/products/${editingProduct._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Product updated successfully");
        setEditingProduct(null); // Reset editing mode
      } else {
        response = await axios.post(`${apiBaseUrl}/api/products`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Product created successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error creating/updating product:", error.response?.data || error.message);
      alert(`Error: ${error.response?.data?.message || "Something went wrong"}`);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setImage(null);
    setImagePreview(null);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete this product?");
      if (confirmDelete) {
        await axios.delete(`${apiBaseUrl}/api/products/${productId}`);
        alert("Product deleted successfully");
        fetchProducts(); // Refresh product list after deletion
      }
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
      alert("Error deleting product");
    }
  };

  const handleUpdateQuantity = async (productId, change) => {
    try {
      const response = await axios.put(`${apiBaseUrl}/api/products/${productId}/quantity`, { change });
  
      if (response.status === 200) {
        const updatedProduct = response.data.product;
  
        // Update the total quantity
        setTotalQuantity((prevTotal) => prevTotal + change);
  
        // Update the product list with the new quantity
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? { ...product, quantity: updatedProduct.quantity } : product
          )
        );
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Error updating quantity");
    }
  };
  const ExpandableText = ({ text, productId, expanded, setExpanded }) => {
    const isExpanded = expanded === productId;
    
    return (
      <div style={{ position: "relative", display: "inline-block", maxWidth: "100%" }}>
        {/* Collapsed Text (2 lines) */}
        {!isExpanded ? (
          <div
            style={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2, // Shows only 2 lines when collapsed
              overflow: "hidden",
              textOverflow: "ellipsis",
              minHeight: "3em", // Ensures height consistency
              lineHeight: "1.5em",
            }}
          >
            {text}
          </div>
        ) : null}
  
        {/* Read More / Read Less Toggle */}
        <span
          style={{
            color: "blue",
            cursor: "pointer",
            fontWeight: "bold",
            display: "block",
            marginTop: "4px",
          }}
          onClick={() => setExpanded(isExpanded ? null : productId)}
        >
          {isExpanded ? "Read Less" : "Read More"}
        </span>
  
        {/* Popup for Expanded Text */}
        {isExpanded && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "300px", // Fixed width for consistency
              minHeight: "100px", // Ensures a minimum size
              maxHeight: "400px", // Expands based on content
              overflowY: "auto", // Enables scrolling for long content
              backgroundColor: "white",
              padding: "10px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
              zIndex: 999,
              borderRadius: "8px",
              marginTop: "5px",
              textAlign: "left",
            }}
          >
            {text}
  
            {/* Close button inside the popup */}
            <div
              style={{
                textAlign: "center",
                marginTop: "8px",
                color: "blue",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={() => setExpanded(null)}
            >
              Read Less
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setDescription(product.description);
    setPrice(product.price);
    setQuantity(product.quantity);
    setCategory(product.category._id);
    setImagePreview(product.image ? `${apiBaseUrl}${product.image}` : null); // Image preview for editing
  };

  

  return (
    <Container style={{ padding: "30px", maxWidth: "1100px" }}>
      <Row>
        <Col md={3}>
          <Adminmenu />
        </Col>
        <Col md={9}>
          <Card style={{ padding: "20px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "12px", border: "none" }}>
            <h4 style={{ textAlign: "center", fontWeight: "bold", color: "#333" }}>
              {editingProduct ? "Edit Product" : "Create Product"}
            </h4>

            <Form.Group className="mb-3" style={{ position: "relative" }}>
  <Form.Control
    type="text"
    placeholder="Search Products..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />

  {/* 🔥 Live Search Preview Dropdown 🔥 */}
  {searchQuery && (
    <div
      style={{
        position: "absolute",
        background: "white",
        border: "1px solid #ddd",
        width: "100%",
        zIndex: 1000,
        maxHeight: "250px",
        overflowY: "auto",
        borderRadius: "5px",
        padding: "5px",
        boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
      }}
    >
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product._id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
              cursor: "pointer",
              borderBottom: "1px solid #eee",
            }}
            onClick={() => console.log("Navigate to:", product._id)}
          >
            <img
              src={`${apiBaseUrl}${product.image}`}
              alt={product.name}
              style={{
                width: "50px",
                height: "50px",
                marginRight: "10px",
                objectFit: "cover",
                borderRadius: "5px",
              }}
            />
            <span>{product.name}</span>
          </div>
        ))
      ) : (
        <p style={{ padding: "10px", textAlign: "center", color: "#999" }}>
          No products found
        </p>
      )}
    </div>
  )}
</Form.Group>



            <Form onSubmit={handleProductSubmit} style={{ marginTop: "20px" }}>
              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Product Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter Product Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price (₹)</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min="100"
                  step="10"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  min="0"
                  step="1"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Select Category</Form.Label>
                <Form.Control
                  as="select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((categoryItem) => (
                    <option key={categoryItem._id} value={categoryItem._id}>
                      {categoryItem.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Upload Product Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && <Image src={imagePreview} alt="Preview" fluid style={{ marginTop: "10px", maxHeight: "150px" }} />}
              </Form.Group>

              <Button type="submit" style={{ width: "100%", fontWeight: "bold" }}>
                {editingProduct ? "Update Product" : "Add Product"}
              </Button>
            </Form>
          </Card>

          <Card
            style={{
              padding: "20px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              borderRadius: "12px",
              border: "none",
              marginTop: "20px",
            }}
          >
            <h4 style={{ textAlign: "center", fontWeight: "bold", color: "#333" }}>Product List</h4>

            <Form.Group className="mb-3">
              <Form.Label>Filter by Category</Form.Label>
              <Form.Control as="select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Card.Text style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", color: "#555" }}>
                  Total Quantity: {totalQuantity}
</Card.Text>

<Row>
  {products.map((product) => (
    <Col key={product._id} md={4} className="mb-4">
      <Card style={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
  <Image
    src={`${apiBaseUrl}${product.image}`}
    fluid
    alt={product.name}
    style={{ height: "200px", objectFit: "cover", width: "100%" }} // Set fixed height
  />
  <Card.Body style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
    <Card.Title>{product.name}</Card.Title>
    
    <ExpandableText text={product.description} productId={product._id} expanded={expanded} setExpanded={setExpanded} />





    <Card.Text>₹{product.price}</Card.Text>

    {/* Quantity Update Buttons */}
    <div className="d-flex justify-content-between align-items-center mb-3">
      <Button
        variant="outline-secondary"
        onClick={() => handleUpdateQuantity(product._id, -1)}
        disabled={product.quantity <= 0} // Prevent negative quantity
      >
        -
      </Button>
      <span style={{ fontWeight: "bold", fontSize: "16px" }}>{product.quantity}</span>
      <Button
        variant="outline-secondary"
        onClick={() => handleUpdateQuantity(product._id, 1)}
      >
        +
      </Button>
    </div>

    {/* Buttons section placed at the bottom */}
    <div>
      <Button
        variant="warning"
        onClick={() => handleEditProduct(product)}
        style={{ width: "100%", fontWeight: "bold", marginBottom: "10px" }}
      >
        Update Product
      </Button>
      <Button
        variant="danger"
        onClick={() => handleDeleteProduct(product._id)}
        style={{ width: "100%", fontWeight: "bold" }}
      >
        Delete Product
      </Button>
    </div>
  </Card.Body>
</Card>

    </Col>
  ))}
</Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateProduct;
