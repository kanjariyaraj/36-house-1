import type { NextApiRequest, NextApiResponse } from 'next';
import { getVendorById, updateVendor } from '../../db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id: vendorId } = req.query;
    const { rating } = req.body;

    if (typeof rating !== 'number' || rating < 0 || rating > 5) {
        return res.status(400).json({ message: 'Invalid rating value. Must be a number between 0 and 5.' });
    }

    try {
        const vendor = await getVendorById(vendorId as string);
        
        if (!vendor) {
            return res.status(404).json({ message: `Vendor with ID ${vendorId} not found.` });
        }

        const updatedVendor = await updateVendor(vendorId as string, {
            performance: {
                ...vendor.performance,
                organizerRating: rating
            }
        });

        if (updatedVendor) {
            res.status(200).json(updatedVendor);
        } else {
            res.status(500).json({ message: 'Failed to update vendor rating' });
        }
    } catch (error) {
        console.error('Error updating vendor rating:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}