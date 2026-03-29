import express from 'express';
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/', userRoutes);

export default router;