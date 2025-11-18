import express from 'express';
import {
    registerUserController,
    loginUserController,
    getUserProfileController,
    updateUserProfileController,
    addProductToWishlistController,
    removeProductFromWishlistController,
    getUserWishlistController,
    getAllUsersController,
    getUserByIdController,
    deleteUserController,
    updateUserRoleController,
} from '../controllers/userController.js';
import { auth, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerUserController);
router.post('/login', loginUserController);

router.route('/profile')
    .get(auth, getUserProfileController)
    .put(auth, updateUserProfileController);

router.route('/wishlist')
    .get(auth, getUserWishlistController)
    .post(auth, addProductToWishlistController);

router.delete('/wishlist/:productId', auth, removeProductFromWishlistController);

router.get('/', auth, authorizeRoles('admin'), getAllUsersController);
router.route('/:id')
    .get(auth, authorizeRoles('admin'), getUserByIdController)
    .delete(auth, authorizeRoles('admin'), deleteUserController);

router.put('/:id/role', auth, authorizeRoles('admin'), updateUserRoleController);

export default router;
