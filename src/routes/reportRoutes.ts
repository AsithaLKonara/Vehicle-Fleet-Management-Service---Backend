import { Router } from 'express';
import * as reportController from '../controllers/reportController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);
router.use(authorize(['ADMIN', 'FLEET_MANAGER']));

router.get('/vehicles/export', reportController.exportVehicles);
router.get('/assignments/export', reportController.exportAssignments);
router.get('/audit/export', reportController.exportAuditLogs);

export default router;
