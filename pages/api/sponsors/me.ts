import type { NextApiRequest, NextApiResponse } from 'next';
import { SponsorData } from '../../../types';
import { getDB } from '../db';
import { decodeJwt } from '../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse<SponsorData | { message: string }>) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const payload = decodeJwt(token);
        const userEmail = payload.email as string;

        // In a real multi-sponsor app, you'd have a mapping. Here we simulate it.
        // e.g., 'contact@innovatecorp.com' -> 'InnovateCorp'
        const sponsorName = userEmail.split('@')[1].split('.')[0].replace(/^\w/, c => c.toUpperCase());

        const db = getDB();
        const sponsorData = db.sponsors.find(s => s.sponsorName === sponsorName);
        
        if (!sponsorData) {
            // Fallback to the first sponsor if no specific one is found
            const fallbackSponsor = db.sponsors[0];
            if (!fallbackSponsor) return res.status(404).json({ message: 'Sponsor data not found' });
            return res.status(200).json(fallbackSponsor);
        }

        res.status(200).json(sponsorData);

    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}