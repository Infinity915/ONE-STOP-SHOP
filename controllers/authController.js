const { hashPassword, comparePassword } = require("../helpers/authHelper");
const userModel = require("../models/userModel"); // ✅ Keep only this import
const jwt = require("jsonwebtoken");

// Register Controller
const registerController = async (req, res) => {
  try {
    const { name, email, password, address, phone, role, answer } = req.body;

    if (!name) return res.status(400).send({ error: "Name is required" });
    if (!email) return res.status(400).send({ error: "Email is required" });
    if (!password) return res.status(400).send({ error: "Password is required" });
    if (!address) return res.status(400).send({ error: "Address is required" });
    if (!phone) return res.status(400).send({ error: "Phone number is required" });
    if (!answer) return res.status(400).send({ error: "Answer is required" });

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "ALREADY REGISTERED USER PLEASE LOG IN"
      });
    }

    const hashedPassword = await hashPassword(password);
    const user = await userModel.create({ name, email, address, phone, password: hashedPassword, role, answer });

    res.status(201).send({
      success: true,
      message: "User Created Successfully",
      user
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in creating new user",
      error: error.message
    });
  }
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({ error: "EMAIL OR PASSWORD IS NOT VALID" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "EMAIL IS NOT REGISTERED PLEASE SIGN UP"
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "PASSWORD IS INCORRECT"
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(200).send({
      success: true,
      message: "Login Successful",
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role
      },
      token,
      redirectTo: user.role === 1 ? '/admindashboard' : '/dashboard'
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in login user",
      error: error.message
    });
  }
};

// Forgot Password Controller
const forgotpassController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) return res.status(400).send({ error: "Email is required" });
    if (!answer) return res.status(400).send({ error: "Answer is required" });
    if (!newPassword) return res.status(400).send({ error: "New Password is required" });

    const user = await userModel.findOne({ email, answer });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or answer"
      });
    }

    const hashed = await hashPassword(newPassword);
    user.password = hashed;
    await user.save();

    res.status(200).send({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in changing password",
      error: error.message
    });
  }
};

// User Auth Controller
const userAuth = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ ok: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id).select('-password');

    if (!user) {
      return res.status(401).json({ ok: false });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Error in userAuth:', error.message);
    res.status(401).json({ ok: false, error: error.message });
  }
};

// Admin Auth Controller
const adminAuth = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ ok: false });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id).select('-password');

    if (!user || user.role !== 1) {
      return res.status(401).json({ ok: false });
    }

    res.json({ ok: true });
  } catch (error) {
    console.error('Error in adminAuth:', error.message);
    res.status(401).json({ ok: false, error: error.message });
  }
};

//  Fetch all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users", error });
  }
};

//  Block/Unblock a user
const toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById(id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({ success: true, message: `User ${user.isBlocked ? "Blocked" : "Unblocked"} Successfully` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error blocking user", error });
  }
};

// Test Controller
const testController = (req, res) => {
  res.send("TEST PAGE");
};

//  Delete user by ID
const deleteUserController = async (req, res) => {
  try {
    const user = await userModel.findByIdAndDelete(req.params.id); //  FIXED LINE
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//  Update User Role (Admin only)
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({ message: "Server error" });
  }
};


//  Export all controllers
module.exports = { 
  registerController, 
  loginController, 
  testController, 
  forgotpassController, 
  userAuth, 
  adminAuth,
  getAllUsers,
  toggleBlockUser,
  deleteUserController,
  updateUserRole
};
