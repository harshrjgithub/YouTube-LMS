
import express from 'express';
import { register, login } from '../controllers/user.controller.js';

const router = express.Router();

// Use controllers directly instead of wrapping them
router.post('/register', register);
router.post('/login', login);

export default router;


