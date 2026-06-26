import express from 'express';
import authController from '../Controllers/authController.js';

const router = express.Router();

router.post('/login', authController.login);
router.put('/modifier-password', authController.modifierPass); // <-- Nouvelle route

export default router;