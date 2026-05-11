import { Router } from 'express';
import * as assignmentController from '../controllers/assignmentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createAssignmentSchema, returnAssignmentSchema } from '../validators/assignmentValidator';

const router = Router();

router.use(authMiddleware);

router.get('/', assignmentController.listAssignments);
router.post('/', authorize(['ADMIN', 'FLEET_MANAGER']), validate(createAssignmentSchema), assignmentController.createAssignment);
router.patch('/:id/return', authorize(['ADMIN', 'FLEET_MANAGER']), validate(returnAssignmentSchema), assignmentController.returnVehicle);

export default router;
