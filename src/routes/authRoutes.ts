import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middleware/validateMiddleware';
import { loginSchema } from '../validators/authValidator';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);

export default router;
