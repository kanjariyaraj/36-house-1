import type { NextApiRequest, NextApiResponse } from 'next';
import { ComplianceDocumentStatus } from '../../../types';
import { getDB, saveDB } from '../db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { docIds, status } = req.body;

    if (!Array.isArray(docIds) || docIds.length === 0 || !status) {
        return res.status(400).json({ message: 'Invalid request body. "docIds" (non-empty array) and "status" are required.' });
    }

    if (!Object.values(ComplianceDocumentStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const db = getDB();
    let updatedCount = 0;
    
    for (const vendor of db.vendors) {
        for (const doc of vendor.documents) {
            if (docIds.includes(doc.id)) {
                doc.status = status;
                updatedCount++;
            }
        }
    }
    
    if (updatedCount === 0) {
        // This is not necessarily an error, maybe the IDs were not found.
        // Return success but indicate nothing was changed.
        return res.status(200).json({ message: 'No matching documents found to update.' });
    }

    saveDB(db);
    res.status(200).json({ message: `${updatedCount} document(s) updated successfully.` });
}
