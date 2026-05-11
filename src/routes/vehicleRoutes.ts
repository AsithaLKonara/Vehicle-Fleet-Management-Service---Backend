import { Router } from 'express';
import * as vehicleController from '../controllers/vehicleController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createVehicleSchema, updateVehicleSchema, getVehiclesQuerySchema } from '../validators/vehicleValidator';

import * as serviceRecordController from '../controllers/serviceRecordController';
import { createServiceRecordSchema } from '../validators/serviceRecordValidator';

const router = Router();

router.use(authMiddleware);

// View routes - Admin, Manager, Staff
router.get('/', validate(getVehiclesQuerySchema), vehicleController.listVehicles);
router.get('/:id', vehicleController.getVehicle);
router.get('/:id/services', serviceRecordController.getVehicleServices);

// Manage routes - Admin, Manager
router.post('/', authorize(['ADMIN', 'FLEET_MANAGER']), validate(createVehicleSchema), vehicleController.createVehicle);
router.patch('/:id', authorize(['ADMIN', 'FLEET_MANAGER']), validate(updateVehicleSchema), vehicleController.updateVehicle);
router.delete('/:id', authorize(['ADMIN', 'FLEET_MANAGER']), vehicleController.deleteVehicle);
router.post('/:id/services', authorize(['ADMIN', 'FLEET_MANAGER']), validate(createServiceRecordSchema), serviceRecordController.addVehicleService);

export default router;
