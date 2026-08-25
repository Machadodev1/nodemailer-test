import { Router } from 'express';
import * as clientsController from '../controllers/clients.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateToken);
router.get('/', clientsController.listClients);
router.get('/new', clientsController.showCreateClient);
router.post('/', clientsController.handleCreateClient);
router.get('/:id/edit', clientsController.showEditClient);
router.post('/:id/update', clientsController.handleUpdateClient);
router.post('/:id/delete', authorizeRole('Admin'), clientsController.handleDeleteClient);

export default router;
