import type { NextApiRequest, NextApiResponse } from 'next';
import { ComplianceDocument, ComplianceDocumentStatus } from '../../../types';
import { getDB, saveDB } from '../db';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const { vendorId, documentName, documentType, fileName } = req.body;
    if (!vendorId || !documentName || !documentType || !fileName) {
        return res.status(400).json({ message: 'Missing required document fields.' });
    }

    const db = getDB();
    const vendor = db.vendors.find(v => v.vendorId === vendorId);
    if (!vendor) {
        return res.status(404).json({ message: `Vendor ${vendorId} not found.` });
    }
    
    const allDocs = db.vendors.flatMap(v => v.documents);
    const newDocId = allDocs.length > 0 ? Math.max(...allDocs.map(d => d.id)) + 1 : 1;

    const newDoc: ComplianceDocument = {
        id: newDocId,
        vendorId,
        documentName,
        documentType,
        fileName,
        submittedDate: new Date().toISOString().split('T')[0],
        status: ComplianceDocumentStatus.Pending,
    };
    
    vendor.documents.unshift(newDoc);
    saveDB(db);
    
    res.status(201).json(newDoc);
}