import type { NextApiRequest, NextApiResponse } from 'next';
import { VendorData } from '../../../types';
import { getAllVendors } from '../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse<VendorData[]>) {
    try {
        const vendors = await getAllVendors();
        res.status(200).json(vendors);
    } catch (error) {
        console.error('Error fetching vendors:', error);
        res.status(500).json([]);
    }
}