import type { NextApiRequest, NextApiResponse } from 'next';
import { User, UserRole } from '../../../types';
import { getDB } from '../db';

export default function handler(req: NextApiRequest, res: NextApiResponse<User[]>) {
    const db = getDB();
    const attendees = db.users
        .filter(u => u.role === UserRole.Attendee)
        .map(({ id, email, role }) => ({ id, email, role })); // Don't send password hash
        
    res.status(200).json(attendees);
}