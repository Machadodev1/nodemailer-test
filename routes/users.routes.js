import { Router } from 'express';
import * as usersController from '../controllers/users.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRole } from '../middleware/role.middleware.js';

const router = Router();

router.use(authenticateToken, authorizeRole('Admin'));
router.get('/', usersController.listUsers);
router.get('/new', usersController.showCreateUser);
router.post('/', usersController.handleCreateUser);
router.get('/:id/edit', usersController.showEditUser);
router.post('/:id/update', usersController.handleUpdateUser);
router.post('/:id/delete', usersController.handleDeleteUser);

export default router;
