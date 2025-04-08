const slugify = require('slugify');
const categoryModel = require('../models/categoryModel');

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(401).send({
        error: 'Name is required',
      });
    }

    const existingCategory = await categoryModel.findOne({ name });

    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: 'Category already exists',
      });
    }

    const category = await new categoryModel({
      name,
      slug: slugify(name),
    }).save();

    res.status(201).send({
      success: true,
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    console.error('Error in creating category:', error);
    res.status(500).send({
      success: false,
      message: 'Error in creating category',
      error,
    });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const { id } = req.params;

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    console.error('Error in updating category:', error);
    res.status(500).send({
      success: false,
      message: 'Error in updating category',
      error,
    });
  }
};

const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.params;
    await categoryModel.findByIdAndDelete(id);
    res.status(200).send({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error in deleting category:', error);
    res.status(500).send({
      success: false,
      message: 'Error in deleting category',
      error,
    });
  }
};

const getAllCategoriesController = async (req, res) => {
  try {
    const categories = await categoryModel.find({});

    res.status(200).send({
      success: true,
      message: 'All categories list',
      categories,
    });
  } catch (error) {
    console.error('Error in getting all categories:', error);
    res.status(500).send({
      success: false,
      message: 'Error in getting all categories',
      error,
    });
  }
};

module.exports = {
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getAllCategoriesController,
};
