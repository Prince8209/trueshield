import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

/**
 * @route   GET /api/health
 * @desc    Health check endpoint — returns server status, uptime, DB state
 * @access  Public
 */
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'ok',
        service: 'trueshield-backend',
        uptime: `${Math.floor(process.uptime())}s`,
        dbState: mongoose.STATES[mongoose.connection.readyState],
        timestamp: new Date().toISOString(),
    });
});

export default router;
