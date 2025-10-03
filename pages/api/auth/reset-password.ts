import type { NextApiRequest, NextApiResponse } from 'next';
import { getDB, saveDB } from '../db';
import { hashPassword } from '../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
        return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const db = getDB();
    const user = db.users.find(u => u.passwordResetToken === token);

    if (!user || !user.passwordResetTokenExpires || user.passwordResetTokenExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired password reset token.' });
    }

    // Reset password and invalidate token
    user.passwordHash = hashPassword(newPassword);
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    saveDB(db);

    res.status(200).json({ message: 'Password has been reset successfully.' });
}
