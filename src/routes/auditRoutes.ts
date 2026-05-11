import { Router } from 'express';
import * as auditController from '../controllers/auditController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';

const router = Router();

router.use(authMiddleware);
router.use(authorize(['ADMIN']));

router.get('/', auditController.getAuditLogs);

export default router;
