import { Router } from 'express';
import * as assignmentController from '../controllers/assignmentController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createAssignmentSchema, returnAssignmentSchema } from '../validators/assignmentValidator';

const router = Router();

router.use(authMiddleware);

router.get('/', assignmentController.listAssignments);
// Staff can also assign and return vehicles
router.post('/', authorize(['ADMIN', 'FLEET_MANAGER', 'FLEET_STAFF']), validate(createAssignmentSchema), assignmentController.createAssignment);
router.patch('/:id/return', authorize(['ADMIN', 'FLEET_MANAGER', 'FLEET_STAFF']), validate(returnAssignmentSchema), assignmentController.returnVehicle);

export default router;
