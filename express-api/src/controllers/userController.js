// controllers/userController.js
import * as userService from '../services/userService.js';

export const registerUserController = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const { user, token } = await userService.registerUser({ firstName, lastName, email, password, role });
        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: user,
            token,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const loginUserController = async (req, res) => {
    try {
        const { email, password } = req.body;
        const { user, token } = await userService.loginUser(email, password);
        res.status(200).json({
            success: true,
            message: 'Logged in successfully.',
            data: user,
            token,
        });
    } catch (error) {
        res.status(401).json({ success: false, message: error.message });
    }
};

export const getUserProfileController = async (req, res) => {
    try {
        const user = await userService.getUserProfile(req.user._id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const updateUserProfileController = async (req, res) => {
    try {
        const { firstName, lastName, email, password, shippingAddress } = req.body;
        const updateData = { firstName, lastName, email, password, shippingAddress };
        const updatedUser = await userService.updateUserProfile(req.user._id, updateData);
        res.status(200).json({
            success: true,
            message: 'Profile updated successfully.',
            data: updatedUser,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const addProductToWishlistController = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await userService.addProductToWishlist(req.user._id, productId);
        res.status(200).json({
            success: true,
            message: 'Product added to wishlist.',
            data: user.wishlist,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const removeProductFromWishlistController = async (req, res) => {
    try {
        const { productId } = req.params;
        const user = await userService.removeProductFromWishlist(req.user._id, productId);
        res.status(200).json({
            success: true,
            message: 'Product removed from wishlist.',
            data: user.wishlist,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const getUserWishlistController = async (req, res) => {
    try {
        const wishlist = await userService.getUserWishlist(req.user._id);
        res.status(200).json({ success: true, data: wishlist });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const getAllUsersController = async (req, res) => {
    try {
        const users = await userService.getAllUsers();
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getUserByIdController = async (req, res) => {
    try {
        const user = await userService.getUserById(req.params.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const deleteUserController = async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully.',
            data: user,
        });
    } catch (error) {
        res.status(404).json({ success: false, message: error.message });
    }
};

export const updateUserRoleController = async (req, res) => {
    try {
        const { role } = req.body;
        const updatedUser = await userService.updateUserRole(req.params.id, role);
        res.status(200).json({
            success: true,
            message: 'User role updated successfully.',
            data: updatedUser,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};
