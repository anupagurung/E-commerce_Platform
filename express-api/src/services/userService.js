// services/userService.js
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData) => {
    const { email, password } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User with this email already exists.');
    }
    const user = await User.create(userData);
    const token = generateToken(user._id);
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return { user: userWithoutPassword, token };
};

export const loginUser = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        throw new Error('Invalid credentials.');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid credentials.');
    }
    const token = generateToken(user._id);
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    return { user: userWithoutPassword, token };
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

export const getUserProfile = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found.');
    }
    return user;
};

export const updateUserProfile = async (userId, updateData) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found.');
    }
    if (updateData.email && updateData.email !== user.email) {
        const existingUser = await User.findOne({ email: updateData.email });
        if (existingUser) {
            throw new Error('Email is already registered.');
        }
    }
    user.firstName = updateData.firstName || user.firstName;
    user.lastName = updateData.lastName || user.lastName;
    user.email = updateData.email || user.email;
    if (updateData.shippingAddress) {
        user.shippingAddress = {
            ...user.shippingAddress,
            ...updateData.shippingAddress
        };
    }
    if (updateData.password) {
        user.password = updateData.password;
    }
    const updatedUser = await user.save();
    return updatedUser;
};

export const addProductToWishlist = async (userId, productId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found.');
    }
    if (user.wishlist.includes(productId)) {
        throw new Error('Product already in wishlist.');
    }
    user.wishlist.push(productId);
    await user.save();
    return user.populate('wishlist', 'name price imageUrl');
};

export const removeProductFromWishlist = async (userId, productId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found.');
    }
    if (!user.wishlist.includes(productId)) {
        throw new Error('Product not found in wishlist.');
    }
    user.wishlist = user.wishlist.filter(
        (item) => item.toString() !== productId.toString()
    );
    await user.save();
    return user.populate('wishlist', 'name price imageUrl');
};

export const getUserWishlist = async (userId) => {
    const user = await User.findById(userId).populate('wishlist', 'name price imageUrl');
    if (!user) {
        throw new Error('User not found.');
    }
    return user.wishlist;
};

export const getAllUsers = async () => {
    const users = await User.find().select('-password');
    return users;
};

export const getUserById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    if (!user) {
        throw new Error('User not found.');
    }
    return user;
};

export const deleteUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId).select('-password');
    if (!user) {
        throw new Error('User not found.');
    }
    return user;
};

export const updateUserRole = async (userId, role) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('User not found.');
    }
    if (!['user', 'admin', 'seller'].includes(role)) {
        throw new Error('Invalid role specified.');
    }
    user.role = role;
    const updatedUser = await user.save();
    return updatedUser.toObject();
};
