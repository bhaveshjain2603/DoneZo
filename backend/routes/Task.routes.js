import express from 'express';
const router = express.Router();

import { getTaskByEmail, addTask, updateTaskById, deleteTaskById } from '../controllers/Task.controllers.js';

router.get('/:userEmail', getTaskByEmail);
router.post('/', addTask);
router.put('/:id', updateTaskById);
router.delete('/:id', deleteTaskById);

export default router;