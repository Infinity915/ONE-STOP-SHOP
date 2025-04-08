// Required dependencies
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const mongoose = require('mongoose');
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");


// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

// Multer middleware
const upload = multer({ storage });

// ✅ Get all products
// ✅ Get all products (with search & category filter)
exports.getAllProducts = async (req, res) => {
  try {
    console.log("🟢 Fetching all products...");
    const { category, search } = req.query;
    let filter = {};

    // ✅ Apply Search Query
    if (search && search.trim() !== "") {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // ✅ Apply Category Filter (if provided)
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    // ✅ Fetch Filtered Products
    const products = await Product.find(filter).populate("category");

    // ✅ Calculate total quantity
    const totalQuantity = products.reduce((sum, product) => sum + product.quantity, 0);

    res.json({ products, totalQuantity }); // Send total quantity in response
  } catch (error) {
    console.error("🔴 Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};



// ✅ Get product by ID
exports.getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("🔴 Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

// ✅ Create a new product
exports.createProduct = async (req, res) => {
  try {
    console.log("🟢 Creating a new product...");
    const { name, description, price, quantity, category } = req.body;
    if (!name || !description || !price || !quantity || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: "Category not found" });
    }

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const newProduct = new Product({
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      category: categoryExists._id,
      image: imagePath,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product created successfully", product: newProduct });
  } catch (error) {
    console.error("🔴 Error creating product:", error);
    res.status(500).json({ message: "Error creating product", error: error.message });
  }
};

//  Update product
exports.updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const { name, description, price, quantity, category } = req.body;

    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let imagePath = product.image;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price: parseFloat(price), quantity: parseInt(quantity, 10), category, image: imagePath },
      { new: true }
    );
    res.json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("🔴 Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

//  Update only product quantity
exports.updateProductQuantity = async (req, res) => {
  try {
    const { change } = req.body; // change should be +1 or -1
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let newQuantity = product.quantity + change;
    if (newQuantity < 0) newQuantity = 0; // Prevent negative quantity

    product.quantity = newQuantity;
    await product.save();

    res.json({ message: "Quantity updated", product });
  } catch (error) {
    console.error("🔴 Error updating quantity:", error);
    res.status(500).json({ message: "Error updating quantity", error: error.message });
  }
};


//  Delete product
exports.deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;
    let filter = {};

    //  Apply Search Query (Matches exact sequence)
    if (search && search.trim() !== "") {
      const regex = new RegExp(`^${search}`, "i"); // Matches from the start of the name
      filter.name = { $regex: regex };
    }

    //  Apply Category Filter (if provided)
    if (category && mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    }

    //  Fetch Filtered Products
    const products = await Product.find(filter).select("name image price");

    res.json({ products });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


// Export Multer middleware for routes
exports.upload = upload;
