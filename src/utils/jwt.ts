import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export const signToken = (payload: object): string =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });

export const verifyToken = (token: string) =>
  jwt.verify(token, JWT_SECRET);
