const express = require('express');
const { 
    registerController, 
    loginController, 
    testController, 
    forgotpassController, 
    userAuth, 
    adminAuth, 
    getAllUsers,  
    toggleBlockUser,
    deleteUserController, //  Add this import
    updateUserRole 
} = require('../controllers/authController');

const { requireSignin, isAdmin } = require('../middlewares/authmiddleware');
const { createCategoryController, updateCategoryController } = require('../controllers/categoryController');

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/forgotpass', forgotpassController);
router.get('/test', requireSignin, isAdmin, testController);

//  User & Admin auth routes
router.get('/userauth', requireSignin, userAuth);
router.get('/adminauth', requireSignin, isAdmin, adminAuth);

//  Admin-only user management routes
router.get('/users', requireSignin, isAdmin, getAllUsers);
router.put('/users/:id/block', requireSignin, isAdmin, toggleBlockUser);

//  DELETE USER by ID (Admin only)
router.delete('/users/:id', requireSignin, isAdmin, deleteUserController); // 🔥 This is what was missing

//  Category routes
router.post('/create-category', requireSignin, isAdmin, createCategoryController);
router.put('/update-category/:id', requireSignin, isAdmin, updateCategoryController);

router.put('/users/:id/role', requireSignin, isAdmin, updateUserRole); // ✅ New route


module.exports = router;
