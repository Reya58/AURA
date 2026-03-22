import { Router } from 'express';
import * as userCtrl from '../controller/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js'; // JWT verification

const router = Router();

router.get('/diseases', authMiddleware, userCtrl.getProfile);
router.post('/update-patient', authMiddleware, userCtrl.addDisease);
router.post('/reminder', authMiddleware, userCtrl.addReminder);
router.get('/fetch-reminders', authMiddleware, userCtrl.getReminders);
router.put('/update-reminder-status', authMiddleware, userCtrl.updateReminderStatus);
router.put('/update', authMiddleware, userCtrl.updateProfile);
router.put('/update-med-status', authMiddleware, userCtrl.updatemedications);
router.get('/latest-health-data',authMiddleware,userCtrl.Latest);

export default router;
