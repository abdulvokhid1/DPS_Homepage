import { Router } from 'express';
import { userRegister, userLogin, userLogout, userMe } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
router.post('/logout', authMiddleware, userLogout);
router.get('/me', authMiddleware, userMe);

export default router;
