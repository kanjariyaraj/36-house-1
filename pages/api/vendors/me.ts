import type { NextApiRequest, NextApiResponse } from 'next';
import { VendorData } from '../../../types';
import { getDB } from '../db';
import { decodeJwt } from '../lib/auth';

export default function handler(req: NextApiRequest, res: NextApiResponse<VendorData | { message: string }>) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const payload = decodeJwt(token);
        const userEmail = payload.email as string;
        
        // Simplified mapping from email to vendorId. e.g., 'alex.chen.vendor@example.com' -> 'Alex Chen'
        const vendorId = userEmail.split('@')[0].replace('.vendor', '').split('.').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
        
        const db = getDB();
        const vendorData = db.vendors.find(v => v.vendorId === vendorId);

        if (!vendorData) {
            return res.status(404).json({ message: 'Vendor data not found' });
        }
        
        res.status(200).json(vendorData);

    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
}