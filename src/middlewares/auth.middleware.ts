import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { Admin } from '../models/Admin';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = verifyToken(token) as any;
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ message: 'User not found' });

    (req as any).user = admin; // ✅ not .admin
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
