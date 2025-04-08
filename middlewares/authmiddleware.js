const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const requireSignin = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from "Bearer <token>"
    if (!token) {
      return res.status(401).send({ message: 'Authorization token required' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).send({ message: 'Invalid or expired token' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: 'Access denied. Admins only.',
      });
    }
    next();
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: 'Server error',
    });
  }
};

module.exports = { requireSignin, isAdmin };
