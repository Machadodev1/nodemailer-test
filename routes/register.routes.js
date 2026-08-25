import { Router } from 'express';
import * as registerController from '../controllers/register.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { authorizeRole } from '../middleware/role.middleware.js';

const router = Router();

router.get('/register', authenticateToken, authorizeRole('Admin'), registerController.showForm);
router.post('/register', authenticateToken, authorizeRole('Admin'), registerController.handleRegister);

export default router;
