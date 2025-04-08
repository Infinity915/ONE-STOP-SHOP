import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/auth";
import { useCart } from "../context/CartContext"; // Import useCart

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:2100";

function Home() {
  const { auth } = useAuth();
  const { addToCart } = useCart(); // Access addToCart function from context
  const user = auth?.user || { name: "Guest", role: 0 };

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedProductId, setExpandedProductId] = useState(null);

  useEffect(() => {
    if (user.role === 0) {
      setLoading(true);

      axios.get(`${API_BASE_URL}/api/category/categories`)
        .then(response => setCategories(response.data.categories || []))
        .catch(error => console.error("Error fetching categories:", error));

      axios.get(`${API_BASE_URL}/api/products`)
        .then(response => setProducts(response.data.products || []))
        .catch(error => console.error("Error fetching products:", error))
        .finally(() => setLoading(false));
    }
  }, [user.role]);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category._id === selectedCategory)
    : products;

  // Function to add product to cart
  const handleAddToCart = (product) => {
    if (product.quantity > 0) {
      addToCart(product); // Add the product to cart using context
      alert(`${product.name} added to cart!`);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f6f9", padding: "20px" }}>
      {user.role === 1 ? (
        <h2 style={{ color: "#dc3545", textAlign: "center", width: "100%" }}>
          Admin access detected. This page is for users only.
        </h2>
      ) : (
        <>
          {/* Sidebar */}
          <aside style={{ width: "250px", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)" }}>
            <h3 style={{ marginBottom: "15px", color: "#333" }}>Categories</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li onClick={() => setSelectedCategory(null)}
                style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ddd", color: selectedCategory === null ? "#007bff" : "#333" }}>
                All Products
              </li>
              {categories.map(category => (
                <li key={category._id} onClick={() => setSelectedCategory(category._id)}
                  style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ddd", color: selectedCategory === category._id ? "#007bff" : "#333" }}>
                  {category.name}
                </li>
              ))}
            </ul>
          </aside>

          {/* Products Section */}
          <main style={{ flex: 1, marginLeft: "20px", background: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0px 3px 6px rgba(0, 0, 0, 0.1)" }}>
            <h2 style={{ fontSize: "22px", color: "#333", marginBottom: "20px" }}>Products</h2>

            {loading ? (
              <p>Loading products...</p>
            ) : filteredProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px",
              }}>
                {filteredProducts.map(product => (
                  <div key={product._id} style={{
                    position: "relative",
                    border: "1px solid #ddd",
                    padding: "15px",
                    borderRadius: "8px",
                    background: "#f9f9f9",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "450px",
                  }}>
                    {/* Product Image */}
                    <img src={product.image ? `${API_BASE_URL}${product.image.startsWith("/") ? product.image : "/" + product.image}` : "/fallback-image.jpg"}
                      alt={product.name}
                      style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "5px" }}
                      onError={(e) => { e.target.onerror = null; e.target.src = "/fallback-image.jpg"; }}
                    />

                    {/* Product Name */}
                    <h3 style={{ margin: "10px 0", color: "#007bff" }}>{product.name}</h3>

                    {/* Description */}
                    <div style={{ flex: 1, minHeight: "50px" }}>
                      <p style={{ fontSize: "14px", color: "#555", overflow: "hidden" }}>
                        {expandedProductId === product._id ? (
                          <>
                            {product.description}
                            <button onClick={() => setExpandedProductId(null)}
                              style={{ background: "none", border: "none", color: "red", cursor: "pointer", fontSize: "14px", marginLeft: "5px" }}>
                              Read Less
                            </button>
                          </>
                        ) : (
                          <>
                            {product.description.length > 100
                              ? `${product.description.substring(0, 100)}... `
                              : product.description}
                            {product.description.length > 100 && (
                              <button onClick={() => setExpandedProductId(product._id)}
                                style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", fontSize: "14px" }}>
                                Read More
                              </button>
                            )}
                          </>
                        )}
                      </p>
                    </div>

                    {/* Price */}
                    <p style={{ fontSize: "16px", fontWeight: "bold", color: "#28a745" }}>₹{product.price}</p>

                    {/* Stock Status */}
                    <p style={{ color: product.quantity > 0 ? "#28a745" : "#dc3545" }}>
                      {product.quantity > 0 ? `In Stock: ${product.quantity}` : "Out of Stock"}
                    </p>

                    {/* Add to Cart */}
                    <button style={{
                      width: "100%",
                      padding: "10px",
                      background: product.quantity > 0 ? "#007bff" : "#ccc",
                      color: "#fff",
                      border: "none",
                      borderRadius: "5px",
                      cursor: product.quantity > 0 ? "pointer" : "not-allowed",
                    }}
                      onClick={() => handleAddToCart(product)}
                      disabled={product.quantity === 0}>
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
}

export default Home;
