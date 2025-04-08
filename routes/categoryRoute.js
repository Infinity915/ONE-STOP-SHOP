const express = require('express');
const { createCategoryController, updateCategoryController, deleteCategoryController, getAllCategoriesController } = require('../controllers/categoryController');
const { requireSignin, isAdmin } = require('../middlewares/authmiddleware');
const router = express.Router();


// Category routes
router.post('/create-category', requireSignin, isAdmin, createCategoryController);
router.put('/update-category/:id', requireSignin, isAdmin, updateCategoryController);
router.delete('/delete-category/:id', requireSignin, isAdmin, deleteCategoryController);
router.get('/categories', getAllCategoriesController);//use this



module.exports = router;
