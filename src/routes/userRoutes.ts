import { Router } from 'express';
import * as userController from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createUserSchema, updateUserSchema } from '../validators/userValidator';

const router = Router();

// User management - Admin and Manager
router.use(authMiddleware);
router.use(authorize(['ADMIN', 'FLEET_MANAGER']));

router.get('/', userController.listUsers);
router.post('/', validate(createUserSchema), userController.createUser);
router.patch('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;
