import { Router } from 'express';
import * as authCtrl from '../controller/auth.controller.js';

const router = Router();

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

export default router;
