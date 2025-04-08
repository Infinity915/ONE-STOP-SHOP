const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0 // 0 for regular users, 1 for admins
    }
}, { timestamps: true });

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
