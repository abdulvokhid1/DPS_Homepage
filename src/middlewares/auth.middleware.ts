// import { Request, Response, NextFunction } from 'express';
// import { verifyToken } from '../utils/jwt';
// import { Admin } from '../models/Admin';

// export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
//   const token = req.cookies.token;
//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   try {
//     const decoded = verifyToken(token) as any;
//     const admin = await Admin.findById(decoded.id).select('-password');
//     if (!admin) return res.status(401).json({ message: 'User not found' });

//     (req as any).user = admin; // ✅ not .admin
//     next();
//   } catch {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };



import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { Admin } from '../models/Admin';
import { User } from '../models/Users';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = verifyToken(token) as any;

    let user;
    if (decoded.role === 'admin') {
      user = await Admin.findById(decoded.id).select('-password');
      // -password is used not to show password field in the object returned from the database
    } else {
      user = await User.findById(decoded.id).select('-password');
    }

    if (!user) return res.status(401).json({ message: 'User not found' });

    (req as any).user = user; // ✅ critical: unified field for both
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
