const mongoose = require('mongoose');
const Category = require('./categoryModel'); // Import Category model for validation

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }, // Use ObjectId for category reference
    image: { type: String }, // Field for image
  },
  { timestamps: true }
);

// Validate category ID before saving
productSchema.pre('save', async function (next) {
  try {
    const categoryExists = await Category.findById(this.category);
    if (!categoryExists) {
      return next(new Error('Invalid category ID'));
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model('Product', productSchema);
