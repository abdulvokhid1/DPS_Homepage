import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt';
import { Admin } from '../models/Admin';

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ message: 'All fields are required' });

  const existing = await Admin.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Admin already exists' });

  const hashed = await bcrypt.hash(password, 12);
  const admin = new Admin({ email, password: hashed, name });
  await admin.save();

  return res.status(201).json({ message: 'Admin registered' });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) return res.status(404).json({ message: 'Admin not found' });

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ id: admin._id, email: admin.email });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return res.json({ message: 'Logged in' });
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('token');
  return res.json({ message: 'Logged out' });
};

export const getMe = (req: Request, res: Response) => {
  const admin = (req as any).admin;
  if (!admin) return res.status(401).json({ message: 'Unauthorized' });
  return res.json(admin);
};
