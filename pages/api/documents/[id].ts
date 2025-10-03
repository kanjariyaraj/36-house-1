import type { NextApiRequest, NextApiResponse } from 'next';
import { ComplianceDocumentStatus } from '../../../types';
import { getDB, saveDB } from '../db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        res.setHeader('Allow', ['PUT']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { id } = req.query;
    const { status } = req.body;
    const docId = parseInt(id as string, 10);

    if (!Object.values(ComplianceDocumentStatus).includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const db = getDB();
    let found = false;
    
    for (const vendor of db.vendors) {
        const docIndex = vendor.documents.findIndex(d => d.id === docId);
        if (docIndex !== -1) {
            vendor.documents[docIndex].status = status;
            found = true;
            break;
        }
    }
    
    if (!found) {
        return res.status(404).json({ message: `Document with ID ${docId} not found.` });
    }

    saveDB(db);
    res.status(200).json({ message: 'Document status updated successfully.' });
}