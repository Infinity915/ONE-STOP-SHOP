const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  upload,
  updateProductQuantity,
} = require('../controllers/productController');

// Ensure API matches frontend calls
// Corrected routing in productRoute.js
router.get('/', getAllProducts); // No need to add "products" here
router.get('/:id', getProductById);
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);
router.put('/:id/quantity', updateProductQuantity);//ye add kiya

module.exports = router;
