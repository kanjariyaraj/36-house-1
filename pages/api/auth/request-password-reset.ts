import type { NextApiRequest, NextApiResponse } from 'next';
import { getDB, saveDB } from '../db';
import { generateResetToken } from '../lib/auth';

const ONE_HOUR = 3600 * 1000;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    const db = getDB();
    const user = db.users.find(u => u.email === email);

    if (user) {
        const token = generateResetToken();
        const expires = Date.now() + ONE_HOUR;

        user.passwordResetToken = token;
        user.passwordResetTokenExpires = expires;
        saveDB(db);

        // --- SIMULATE SENDING EMAIL ---
        // In a real app, you'd use a service like SendGrid or Nodemailer here.
        const resetLink = `${req.headers.origin}?reset-token=${token}`;
        console.log('--- PASSWORD RESET SIMULATION ---');
        console.log(`Password reset link for ${email}:`);
        console.log(resetLink);
        console.log('--- END SIMULATION ---');
    }
    
    // Always return a generic success response to prevent email enumeration.
    res.status(200).json({ message: 'If an account with this email exists, a password reset link has been sent.' });
}
