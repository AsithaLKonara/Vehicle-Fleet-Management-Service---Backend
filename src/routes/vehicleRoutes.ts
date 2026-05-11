import { Router } from 'express';
import * as vehicleController from '../controllers/vehicleController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorize } from '../middleware/roleMiddleware';
import { validate } from '../middleware/validateMiddleware';
import { createVehicleSchema, updateVehicleSchema, getVehiclesQuerySchema } from '../validators/vehicleValidator';

const router = Router();

router.use(authMiddleware);

// View routes - Admin, Manager, Staff
router.get('/', validate(getVehiclesQuerySchema), vehicleController.listVehicles);
router.get('/:id', vehicleController.getVehicle);

// Manage routes - Admin, Manager
router.post('/', authorize(['ADMIN', 'FLEET_MANAGER']), validate(createVehicleSchema), vehicleController.createVehicle);
router.patch('/:id', authorize(['ADMIN', 'FLEET_MANAGER']), validate(updateVehicleSchema), vehicleController.updateVehicle);
router.delete('/:id', authorize(['ADMIN', 'FLEET_MANAGER']), vehicleController.deleteVehicle);

export default router;
