import express from 'express';
import { getUsers, getUserById, updateUserRole } from '../controllers/userController';

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id/role', updateUserRole);

export default router;
