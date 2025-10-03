import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail, createUser } from '../db';
import { createJwt, hashPassword } from '../lib/auth';
import { UserRole } from '../../../types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required.' });
    }
    
    if (!Object.values(UserRole).includes(role)) {
        return res.status(400).json({ message: 'Invalid user role.' });
    }

    try {
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists.' });
        }

        const newUser = {
            id: `user_${Date.now()}`,
            email,
            passwordHash: hashPassword(password),
            role,
        };
        
        const createdUser = await createUser(newUser);
        
        if (!createdUser) {
            return res.status(500).json({ message: 'Failed to create user.' });
        }
        
        const userForToken = { id: newUser.id, email: newUser.email, role: newUser.role };
        const token = createJwt({ sub: newUser.id, email: newUser.email, role: newUser.role });

        res.status(201).json({ token, user: userForToken });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}