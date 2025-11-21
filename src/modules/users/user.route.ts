import { Router } from 'express';
import { UserController } from './user.controller';
import { validate } from '@shared/middlewares/validate';
import { updateUserSchema, updateProfileSchema } from './user.dto';
import { authenticate,authorize } from '@modules/auth/auth.middleware';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

// User routes
router.get('/me', userController.getMe);
router.get('/stats', userController.getUserStats);
router.patch('/me', validate(updateUserSchema), userController.updateUser);
router.patch('/profile', validate(updateProfileSchema), userController.updateProfile);
router.post('/avatar', userController.uploadAvatar);
router.delete('/me', userController.deleteUser);

// Admin routes
router.get('/', authorize('ADMIN'), userController.getAllUsers);
router.get('/:id', authorize('ADMIN'), userController.getUserById);

export default router;