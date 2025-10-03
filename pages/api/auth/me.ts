import type { NextApiRequest, NextApiResponse } from 'next';
import { getDB } from '../db';
import { decodeJwt } from '../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }
    
    try {
        const token = authHeader.split(' ')[1];
        const payload = decodeJwt(token);
        const db = getDB();
        const user = db.users.find(u => u.id === payload.sub);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({ id: user.id, email: user.email, role: user.role });

    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}