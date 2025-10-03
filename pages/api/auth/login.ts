import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserByEmail } from '../db';
import { createJwt, comparePassword } from '../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const userRecord = await getUserByEmail(email);

        if (!userRecord || !comparePassword(password, userRecord.passwordHash)) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const userForToken = { id: userRecord.id, email: userRecord.email, role: userRecord.role };
        const token = createJwt({ sub: userRecord.id, email: userRecord.email, role: userRecord.role });

        res.status(200).json({ token, user: userForToken });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}